angular.module('rest', ['ngResource']).
    factory('Scripts', function ($resource) {
        var Scripts = $resource(
            'scriptlib/scripts/:id', {},
            {
                query:{method:'GET', params:{id:'scripts'}, isArray:true}
            }
        );

        return Scripts;
    });