// SOURCE:
// https://www.jstree.com/docs/interaction/

var input = document.getElementById('files');
var treeJSON = [];
var fileICON = "http://imdbnator.com/test/images/file.png";
var fileSelected = [];
var SUBJECT = [];

var idcount = 0;
var idmap = {};
function add(dirs, isfolder) {
    if (!dirs.length) return "#";
    var name = dirs.join("/");
    if (name in idmap) {
        if (isfolder && idmap[name].icon)
            delete idmap[name].icon;
        return idmap[name];
    }
    var dir = dirs.pop();
    var parent = add(dirs, true);
    var id = "ajson" + ++idcount;
    var item = {id: id, parent: parent, text: dir}

    if (parent == "#")
        item.state = {opened:true, selected:true};
    if (!isfolder && dir.indexOf(".") > 0)
        item.icon = fileICON;

    
    treeJSON.push(item);

    return idmap[name] = id;
}

input.onchange = function(e) {
    var files = e.target.files; // FileList
    for (var i=0; i<files.length; ++i) {
        var filePath = files[i].webkitRelativePath;
        var fileName = files[i].name;
        if (fileName.indexOf(".") > 0)
            add(filePath.split("/"), false);
    }
    $('#tree')
    .jstree({
        'core': {
            'check_callback': true,
            'data': function (node, cb) {
                cb.call(this, treeJSON);
            }
        },
        'plugins':['wholerow']
    });

    $('#tree')
    .on('changed.jstree', function (e, data) {
        var i, j, r = [];
        for(i = 0, j = data.selected.length; i < j; i++) {
            fullpath = data.instance.get_path(data.selected[i]).join('/');
            r.push(fullpath);
        }
        fileSelected = r.join(', ');

        SUBJECT = treeJSON[0].text;
        $("label[for='files']").text(SUBJECT);


    });

    var tree = $('#tree').jstree(true);
    tree.refresh();

    $('#tree').on('ready', function() {
                SUBJECT = treeJSON[0].text;
        $("label[for='files']").text(SUBJECT);
    });
};

