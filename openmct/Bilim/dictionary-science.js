
define([
    //"./ScienceLimitProvider",
], function (
    //ScienceLimitProvider
) {
    
    

    function SciencePlugin() {

        function getScienceDictionary() {
            return Promise.resolve({
        name: "Science",
        key: "sc",
        measurements: [
            {
                name: "Drill-to-Ground Distance",
                key: "dist.drill",
                topic: "wheel_front_left_angle",
                values: [
                    {
                        key: "value",
                        name: "Value",
                        units: "bytes",
                        format: "integer",
                        hints: { range: 1 }
                    },
                    {
                        key: "utc",
                        source: "timestamp",
                        name: "Timestamp",
                        format: "utc",
                        hints: { domain: 1 }
                    }
                ]
            },
            {
                name: "Drill Rotation Speed",
                key: "speed.rotation_drill",
                topic: "wheel_front_right_angle",
                values: [
                    {
                        key: "value",
                        name: "Value",
                        units: "bytes",
                        format: "integer",
                        hints: { range: 1 }
                    },
                    {
                        key: "utc",
                        source: "timestamp",
                        name: "Timestamp",
                        format: "utc",
                        hints: { domain: 1 }
                    }
                ]
            },
            {
                name: "Pipe-to-Ground Distance",
                key: "dist.pipe",
                topic: "wheel_rear_left_angle",
                values: [
                    {
                        key: "value",
                        name: "Value",
                        units: "bytes",
                        format: "integer",
                        hints: { range: 1 }
                    },
                    {
                        key: "utc",
                        source: "timestamp",
                        name: "Timestamp",
                        format: "utc",
                        hints: { domain: 1 }
                    }
                ]
            },
            {
                name: "Pipe Descent Speed",
                key: "speed.pipe_descent",
                topic: "wheel_rear_right_angle",
                values: [
                    {
                        key: "value",
                        name: "Value",
                        units: "bytes",
                        format: "integer",
                        hints: { range: 1 }
                    },
                    {
                        key: "utc",
                        source: "timestamp",
                        name: "Timestamp",
                        format: "utc",
                        hints: { domain: 1 }
                    }
                ]
            },
            {
                name: "Drill Descent Speed",
                key: "speed.drill_descent",
                topic: "wheel_front_left_speed",
                values: [
                    {
                        key: "value",
                        name: "Value",
                        units: "bytes",
                        format: "integer",
                        hints: { range: 1 }
                    },
                    {
                        key: "utc",
                        source: "timestamp",
                        name: "Timestamp",
                        format: "utc",
                        hints: { domain: 1 }
                    }
                ]
            },
            {
                name: "Sample Index",
                key: "index.sample",
                topic: "wheel_front_right_speed",
                values: [
                    {
                        key: "value",
                        name: "Value",
                        units: "bytes",
                        format: "integer",
                        hints: { range: 1 }
                    },
                    {
                        key: "utc",
                        source: "timestamp",
                        name: "Timestamp",
                        format: "utc",
                        hints: { domain: 1 }
                    }
                ]
            },
            {
                name: "Sample Collection Active",
                key: "collct.sample",
                topic: "wheel_rear_left_speed",
                values: [
                    {
                        key: "value",
                        name: "Value",
                        units: "bytes",
                        format: "integer",
                        hints: { range: 1 }
                    },
                    {
                        key: "utc",
                        source: "timestamp",
                        name: "Timestamp",
                        format: "utc",
                        hints: { domain: 1 }
                    }
                ]
            },
            {
                name: "Fluid Flow Active",
                key: "collct.fluid",
                topic: "wheel_rear_right_speed",
                values: [
                    {
                        key: "value",
                        name: "Value",
                        units: "bytes",
                        format: "integer",
                        hints: { range: 1 }
                    },
                    {
                        key: "utc",
                        source: "timestamp",
                        name: "Timestamp",
                        format: "utc",
                        hints: { domain: 1 }
                    }
                ]
            }
        ]
    });


        }

        // An object provider builds Domain Objects
        var Science_objectProvider = {
            get: function (identifier) {
                return getScienceDictionary().then(function (dictionary) {
                    //console.log("Science-dictionary-plugin.js: identifier.key = " + identifier.key);
                    if (identifier.key === 'science_') {
                return {
                    identifier: identifier,
                    name: dictionary.name,
                    topic: dictionary.topic,
                    type: 'folder',
                    location: 'ROOT'
                };
            } else {
                var measurement = dictionary.measurements.filter(function (m) {
                    return m.key === identifier.key;
                    
                })[0];
                return {
                    identifier: identifier,
                    name: measurement.name,
                    topic: measurement.topic,
                    type: 'science.telemetry',
                    telemetry: {
                        values: measurement.values
                    },
                    location: 'science.taxonomy:science_'
                };
            }
                });
            }
        };

        // The composition of a domain object is the list of objects it contains, as shown (for example) in the tree for browsing.
        // Can be used to populate a hierarchy under a custom root-level object based on the contents of a telemetry dictionary.
        // "appliesTo"  returns a boolean value indicating whether this composition provider applies to the given object
        // "load" returns an array of Identifier objects (like the channels this telemetry stream offers)
        var Science_compositionProvider = {
            appliesTo: function (domainObject) {
                return domainObject.identifier.namespace === 'science.taxonomy'
                    && domainObject.type === 'folder';
            },
            load: function (domainObject) {
                return getScienceDictionary()
                    .then(function (dictionary) {
                        return dictionary.measurements.map(function (m) {
                            return {
                                namespace: 'science.taxonomy',
                                key: m.key
                            };
                        });
                    });
            }
        };

        return function install(openmct) {
            // The addRoot function takes an "object identifier" as an argument
            openmct.objects.addRoot({
                namespace: 'science.taxonomy',
                key: 'science_'
            });

            openmct.objects.addProvider('science.taxonomy', Science_objectProvider);

            openmct.composition.addProvider(Science_compositionProvider);

            openmct.types.addType('science.telemetry', {
                name: 'Science Telemetry Point',
                description: 'Telemetry of Science',
                cssClass: 'icon-telemetry'
            });

            //openmct.telemetry.addProvider(new ScienceLimitProvider());
        };
    }

    return SciencePlugin;
});
