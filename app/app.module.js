import angular from 'angular';
import uirouter from 'angular-ui-router';
import metacoin from './metacoin/metacoin.module';
import crc from './crc/crc.module';

require('./main.scss');

angular.module('app', [
  uirouter,
  'metacoin',
  'crc'
]);
