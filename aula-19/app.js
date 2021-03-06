var Usuarios = angular.module('Usuarios', ['ngRoute', 'ngResource']);

Usuarios.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/usuarios', {
            templateUrl : 'templates/usuarios/lista.html',
            controller : 'UsuariosController'
        })
        .when('/usuarios/:id/edita', {
            templateUrl : 'templates/usuarios/editar.html',
            controller : 'UsuariosController'
        })
        .when('/usuarios/:id/remove', {
            controller : 'UsuariosController'
        })
        .when('/usuarios/add', {
            templateUrl : 'templates/usuarios/add.html',
            controller : 'UsuariosController'
        });
}]);

Usuarios.directive('tbBtn', [function(){
    return {
        restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
        link: function($scope, iElm, iAttrs, controller) {
            iElm.addClass('btn btn-'+iAttrs.tbBtn);
            if(iAttrs.tbBtnSize)
                iElm.addClass('btn-'+iAttrs.tbBtnSize);
        }
    };
}]);

Usuarios.directive('tbForm', [function(){
    return {
        restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
        link: function($scope, iElm, iAttrs, controller) {
            iElm.find('input').addClass('form-control');
        }
    };
}]);

Usuarios.factory('Usuarios', ['$resource', function($resource){
    return $resource('http://localhost:8765/server/usuarios/:id', null, {
        'update': {
            method: 'PUT'
        }
    });
}])

Usuarios.controller('UsuariosController', ['$scope', 'Usuarios', '$location', '$routeParams', function($scope, Usuario, $location, $routeParams) {
    $scope.usuarios = Usuario.query();

    $scope.novo = function() {
        Usuario.save(
            {},
            $scope.usuario,
            function() {//success
                $scope.usuario = '';
                if(confirm('Salvo com sucesso. Voltar para aindex?'))
                        $location.path('/usuario');
            },
            function(data, status) {//error
                alert('Não possível salvar! Erro '+status);
            }
        );
    };

    $scope.ver = function() {
        $scope.usuario = Usuario.get({id:$routeParams.id})
    }

    $scope.editar = function() {
        Usuario.update(
            {id: $routeParams.id},
            $scope.usuario,
            function() {//success
                if(confirm('Salvo com sucesso. Voltar para a index?'))
                        $location.path('/usuario');
            },
            function(data, status) {//error
                alert('Não possível salvar! Erro '+status);
            }
        );

    $scope.remover = function(id) {
        if(confirm('Tem certeza?'))
            Usuario.remove(
                {id: id},
                {},//proprio post
                function() {
                    alert('Removido com sucesso!');
                    $scope.usuarios = Usuario.query();
                },
                function(data, status) {
                    alert('Não pode ser removido, erro '+status);
                }
            );

    }
    }
}]);
