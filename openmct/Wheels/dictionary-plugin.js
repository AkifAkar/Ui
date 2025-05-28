
define([
    //"./Aircraft_42LimitProvider",
], function (
    //Aircraft_42LimitProvider
) {
    
    

    function Aircraft_42Plugin() {

        function getAircraft_42Dictionary() {
            return Promise.resolve({
        name: "Example Spacecraft",
        key: "sc",
        measurements: [
            {
                name: "wheel front left angle",
                key: "prop.fuel",
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
                name: "wheel_front_right_angle",
                key: "prop.thrusters",
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
                name: "wheel_back_left_angle",
                key: "comms.recd",
                topic: "wheel_back_left_angle",
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
                name: "wheel_back_right_angle",
                key: "comms.sent",
                topic: "wheel_back_right_angle",
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
                name: "wheel_front_left_speed",
                key: "pwr.temp",
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
                name: "wheel_front_right_speed",
                key: "pwr.c",
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
                name: "wheel_back_left_speed",
                key: "pwr.v",
                topic: "wheel_back_left_speed",
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
                name: "wheel_back_right_speed",
                key: "pwr.a",
                topic: "wheel_back_right_speed",
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
        var Aircraft_42_objectProvider = {
            get: function (identifier) {
                return getAircraft_42Dictionary().then(function (dictionary) {
                    //console.log("Aircraft_42-dictionary-plugin.js: identifier.key = " + identifier.key);
                    if (identifier.key === 'spacecraft') {
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
                    type: 'example.telemetry',
                    telemetry: {
                        values: measurement.values
                    },
                    location: 'example.taxonomy:spacecraft'
                };
            }
                });
            }
        };

        // The composition of a domain object is the list of objects it contains, as shown (for example) in the tree for browsing.
        // Can be used to populate a hierarchy under a custom root-level object based on the contents of a telemetry dictionary.
        // "appliesTo"  returns a boolean value indicating whether this composition provider applies to the given object
        // "load" returns an array of Identifier objects (like the channels this telemetry stream offers)
        var Aircraft_42_compositionProvider = {
            appliesTo: function (domainObject) {
                return domainObject.identifier.namespace === 'example.taxonomy'
                    && domainObject.type === 'folder';
            },
            load: function (domainObject) {
                return getAircraft_42Dictionary()
                    .then(function (dictionary) {
                        return dictionary.measurements.map(function (m) {
                            return {
                                namespace: 'example.taxonomy',
                                key: m.key
                            };
                        });
                    });
            }
        };

        return function install(openmct) {
            // The addRoot function takes an "object identifier" as an argument
            openmct.objects.addRoot({
                namespace: 'example.taxonomy',
                key: 'spacecraft'
            });

            openmct.objects.addProvider('example.taxonomy', Aircraft_42_objectProvider);

            openmct.composition.addProvider(Aircraft_42_compositionProvider);

            openmct.types.addType('example.telemetry', {
                name: 'Aircraft_42 Telemetry Point',
                description: 'Telemetry of Aircraft_42',
                cssClass: 'icon-telemetry'
            });

            //openmct.telemetry.addProvider(new Aircraft_42LimitProvider());
        };
    }

    return Aircraft_42Plugin;
});
