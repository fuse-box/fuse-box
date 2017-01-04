let a = {...options || {},
    ... {
        sourceType: "module",
        tolerant: true,
        ecmaVersion: 8,
        plugins: { es7: true, jsx: true },
        jsx: { allowNamespacedObjects: true }
    }
}