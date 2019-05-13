import * as _ from 'lodash';
var callback = console.log;

export function TreeViewParser(arr) {
    if (arr instanceof Array) {

        // callback( _.filter(obj, ['Level',1]));
        for (var i = 0; i < arr.length; i++) {
            if (typeof arr[i] == 'object' && arr[i]) {
                String(arr[i]['ObjectId']);
                delete arr[i]['ParentID'];
                delete arr[i]['Type'];
                delete arr[i]['Level'];
                delete arr[i]['ID'];
                if (arr[i].Children.length === 0) {
                    delete arr[i]['Children'];
                }

                TreeViewParser(arr[i]);

            } else {

            }
        }

    } else {
        for (var prop in arr) {
            if (typeof arr[prop] == 'object' && arr[prop]) {
                TreeViewParser(arr[prop]);
            } else {
                // callback(prop, obj[prop]);
            }
        }
    }

}
