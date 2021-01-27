import { MODE } from './mode';

type DIALOG_OPTIONS = {
  [key: string]: any;
};

const ADD_UPDATE_DIALOG_OPTIONS = (height, width) => _getOptions(height, width);

const DELETE_DIALOG_OPTIONS = {
  height: '180px',
  width: '500px',
  disableClose: true
};

const DIALOG_BUTTONS = (mode: string) => {
  return {
    ok: _getTitle(mode),
    cancel: 'Cancel'
  };
};

const DIALOG_HEADER = mode => _getTitle(mode);

function _getOptions(height = 290, width = 500) {
  return {
    height: `${height}px`,
    width: `${width}px`,
    disableClose: true
  };
}

function _getTitle(mode) {
  let title;
  if (mode === MODE.ADD) {title = 'Add'};
  if (mode === MODE.UPDATE) {title = 'Update'} ;
  if (mode === MODE.DELETE) {title = 'Confirm'};
  if (mode === MODE.VIEW) {title = 'View'};
  if (mode === MODE.ASSIGN) {title = 'Assign'};
  if (mode === MODE.COLORVIEW) {title = 'Select Color'};
  
  return title;
}

export {
  ADD_UPDATE_DIALOG_OPTIONS,
  DELETE_DIALOG_OPTIONS,
  DIALOG_OPTIONS,
  DIALOG_BUTTONS,
  DIALOG_HEADER
};

