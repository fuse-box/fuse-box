# src/main/resolver

Handles finding/resolving the import of files, modules, indexes, and pretty much anything with a "require" or "import" keyword.

--------

## resolver.ts
The entry point for resolve a string into a module (ie `include "some-string"`).  
Exports the function `resolveModule()` which starts the import process for any string.

<br>

## fileLookup.ts

Resolves a file path or directory path into a module.  Used by pathsLookup, nodeModulesLookup, and resolver.

<br>

## pathsLookup.ts

Attempts to lookup a target as though it is a project file with a relative or root path (sub-folder/item.ts).

Also attempts to lookup sibling module paths.

<br>

## nodeModuleLookup.ts

Attempts to include a module as a "node_module".

<br>

## browserField.ts

TODO: write a brief description

<br>

## shared.ts

Helper functions used by multiple files in this folder.
