import angular from 'angular';
import routing from './metacoin.route';
import component from './metacoin.component';
import service from './metacoin.service';

angular
  .module('metacoin', [])
  .component('metacoin', component)
  .factory('metacoinService', service)
  .config(routing);
