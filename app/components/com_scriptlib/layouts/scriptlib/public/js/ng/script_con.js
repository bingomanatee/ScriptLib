function ScriptCtrl($scope){
    $scope.scripts = Scripts.query();

    $scope.add_script = function(){
        $scope.scripts.push({
            name: $scope.scriptName,
            genres: $scope.scriptGenres,
            summary: $scope.scriptSummary
        })
    }
}