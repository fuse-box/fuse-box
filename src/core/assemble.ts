import { fastAnalysis } from "../analysis/fastAnalysis";
import { resolveModule, IResolver } from "../resolver/resolver";
import { createApplicationPackage } from "./application";
import { Context } from "./context";
import { createModule, Module } from "./Module";
import { createPackage, Package } from "./Package";

interface IDefaultParseProps {
	assemble?: boolean;
	module: Module;
	pkg: Package;
	ctx: Context;
}

function registerPackage(props: { assemble?: boolean; pkg: Package; ctx: Context; resolved: IResolver }) {
	const collection = props.ctx.assembleContext.collection;
	const resolved = props.resolved;
	const packageKey = `${resolved.package.meta.name}:${resolved.package.meta.version}`;
	let pkg: Package = collection.resolvedPackages.get(packageKey);
	if (!pkg) {
		pkg = createPackage({ ctx: props.ctx, meta: resolved.package.meta });
		collection.resolvedPackages.set(packageKey, pkg);
	}
	if (!props.pkg.externalPackages.includes(pkg)) {
		props.pkg.externalPackages.push(pkg);
	}
	let target: Module;
	if (resolved.package.isEntry && !pkg.entry) {
		pkg.entry = createModule(
			{
				absPath: resolved.package.targetAbsPath,
				ctx: props.ctx,
				extension: resolved.package.targetExtension,
				fuseBoxPath: resolved.package.targetAbsPath,
			},
			pkg,
		);
		target = pkg.entry;
	} else if (!resolved.package.isEntry) {
		let userEntry = pkg.userEntries.find(item => item.props.absPath === resolved.package.targetAbsPath);
		if (!userEntry) {
			userEntry = createModule(
				{
					absPath: resolved.package.targetAbsPath,
					ctx: props.ctx,
					extension: resolved.package.targetExtension,
					fuseBoxPath: resolved.package.targetAbsPath,
				},
				pkg,
			);
			pkg.userEntries.push(userEntry);
		}
		target = userEntry;
	}
	if (target && !target.assembled && props.assemble) {
		processModule({ ...props, module: target, pkg: pkg });
	}
	return pkg;
}

function resolveStatement(
	statement,
	props: IDefaultParseProps,
): {
	module?: Module;
	processed?: boolean;
	package?: Package;
} {
	const collection = props.ctx.assembleContext.collection;

	const resolved = resolveModule({
		filePath: props.module.props.absPath,
		homeDir: props.ctx.config.homeDir,
		packageMeta: !props.pkg.isDefaultPackage && props.pkg.props.meta,
		buildTarget: props.ctx.config.target,
		modules: props.ctx.config.modules,
		target: statement,
	});

	if (!resolved || resolved.skip || resolved.isExternal) {
		return;
	}
	if (resolved.package) {
		return {
			package: registerPackage({ assemble: props.assemble, pkg: props.pkg, ctx: props.ctx, resolved: resolved }),
		};
	}
	if (collection.defaultModules.has(resolved.absPath)) {
		return { processed: true, module: collection.defaultModules.get(resolved.absPath) };
	}
	const _module = createModule(
		{
			absPath: resolved.absPath,
			ctx: props.ctx,
			extension: resolved.extension,
			fuseBoxPath: resolved.fuseBoxPath,
		},
		props.pkg,
	);

	collection.defaultModules.set(resolved.absPath, _module);
	return { processed: false, module: _module };
}

function processModule(props: IDefaultParseProps) {
	const _module = props.module;
	props.pkg.modules.push(props.module);
	if (_module.isExecutable()) {
		_module.read();
		_module.fastAnalysis = fastAnalysis({ input: _module.contents });
		_module.assembled = true;
		const dependencies = _module.fastAnalysis.imports;
		const statements = [
			...dependencies.requireStatements,
			...dependencies.fromStatements,
			...dependencies.dynamicImports,
		];
		const modules = statements.map(statement => resolveStatement(statement, props));

		modules.forEach(item => {
			if (!item) {
				return;
			}
			if (item.module) {
				props.module.moduleDependencies.push(item.module);
			}
			if (item.package) {
				props.module.externalDependencies.push(item.package);
			}
			if (item && !item.processed && item.module) {
				processModule({ ...props, module: item.module });
			}
		});
	}
}

function parseDefaultPackage(ctx: Context, pkg: Package) {
	ctx.assembleContext.collection.defaultModules.set(pkg.entry.props.absPath, pkg.entry);
	processModule({
		ctx: ctx,
		pkg: pkg,
		module: pkg.entry,
	});
}

function assemblePackage(pkg: Package, ctx: Context) {
	pkg.externalPackages.forEach(pkg => {
		let modules = [...pkg.userEntries];
		if (pkg.entry) {
			modules.push(pkg.entry);
		}
		modules.map(item => {
			processModule({
				assemble: true,
				module: item,
				pkg: pkg,
				ctx: ctx,
			});
		});
	});
}
export function assemble(ctx: Context, entryFile: string): Array<Package> {
	// default package. Big Bang starts here/
	const pkg = createApplicationPackage(ctx, entryFile);
	parseDefaultPackage(ctx, pkg);
	assemblePackage(pkg, ctx);
	const result = [pkg];
	ctx.assembleContext.collection.resolvedPackages.forEach(p => {
		result.push(p);
	});
	return result;
}
