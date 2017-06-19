import angular from 'angular';
import routing from './crc.route';
import component from './crc.component';
import service from './crc.service';

angular
  .module('crc', [])
  .component('crc', component)
  .factory('crcService', service)
  .config(routing);
