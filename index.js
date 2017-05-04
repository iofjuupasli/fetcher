const fetch = (query) => {
    return _.pipe(
        _.toPairs,
        ([entityName, spec]) => {
            return fetchers[entityName](spec.query)
                .then((entities) => {
                    if (spec.populate) {
                        return Promise.all([
                            [entityName, [entities]],
                            ...(_.map((entity) => fetch({
                                [entityName]: entity.id,
                                ...spec.populate,
                            }), entities)),
                        ]);
                    }
                    return [
                        [entityName, [entities]],
                    ];
                });
        },
        Promise.all,
    )(query);
};
