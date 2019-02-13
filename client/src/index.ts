import {Grid, GridOptions} from 'ag-grid-community';
import 'ag-grid-enterprise';

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";

const gridOptions: GridOptions = {
    columnDefs: [
        {headerName: 'Row Index', valueGetter: (params) => {
            return params.node.rowIndex;
        }},
        {field: 'athlete', filter: 'text'},
        {field: 'country', rowGroup: true, hide: true},
        {field: 'sport', rowGroup: true, hide: true},
        {field: 'year', filter: 'number', filterParams: {newRowsAction: 'keep'}},
        {field: 'gold', aggFunc: 'sum'},
        {field: 'silver', aggFunc: 'sum'},
        {field: 'bronze', aggFunc: 'sum'},
    ],

    defaultColDef: {
        sortable: true,
        enableValue: true,
        enablePivot: true,
        enableRowGroup: true
    },
    sideBar: 'columns',
    rowModelType: 'serverSide',
    cacheBlockSize: 50,
    maxBlocksInCache: 3,
    // maxConcurrentDatasourceRequests: 2,
    // blockLoadDebounceMillis: 1000
};

const gridDiv = document.querySelector('#myGrid') as HTMLElement;
new Grid(gridDiv, gridOptions);

const datasource = {
    getRows(params) {
         console.log(JSON.stringify(params.request, null, 1));

         fetch('./olympicWinners/', {
             method: 'post',
             body: JSON.stringify(params.request),
             headers: {"Content-Type": "application/json; charset=utf-8"}
         })
         .then(httpResponse => httpResponse.json())
         .then(response => {
             params.successCallback(response.rows, response.lastRow);
         })
         .catch(error => {
             console.error(error);
             params.failCallback();
         })
    }
};

gridOptions.api.setServerSideDatasource(datasource);