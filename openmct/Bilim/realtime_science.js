define([
    //"./Aircraft_42LimitProvider",
], function (
    //Aircraft_42LimitProvider
) {
    function RealtimeTelemetryPlugin() {
        return function (openmct) {
            const ros = new ROSLIB.Ros({
                url: 'ws://localhost:9090'  // WebSocket from ros2-web-bridge
            });

            var socket = new WebSocket(location.origin.replace(/^http/, 'ws') + '/realtime/');
            var realtimeSocketListeners = {};
        
            socket.onmessage = function (event) {
                point = JSON.parse(event.data);
                if (realtimeSocketListeners[point.id]) {
                    realtimeSocketListeners[point.id](point);
                }
            };
            
            var provider = {
                supportsSubscribe: function (domainObject) {
                    return domainObject.type === 'science.telemetry';
                },
                subscribe: function (domainObject, callback) {
                    const topicName = domainObject.topic || '/wheel_front_right_angle';

                    const listener = new ROSLIB.Topic({
                        ros: ros,
                        name: topicName,
                        messageType: 'std_msgs/msg/Int32'
                    });
                    

                    listener.subscribe((message) => {
                        callback({
                            id: domainObject.identifier.key,
                            utc: Date.now(),
                            value: message.data
                            
                        });
                    });

                    return () => {
                        listener.unsubscribe();
                    };
                },
                supportsRequest(domainObject) {
                return domainObject.type === 'science.telemetry';
                },
                request(domainObject, options) {
                    return Promise.resolve([]); // Stub to prevent error
                }
                            
            };
            
            openmct.telemetry.addProvider(provider);
        }
    }
    return RealtimeTelemetryPlugin
});