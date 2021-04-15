var cytoscape = require('cytoscape');
var viewUtilities = require('cytoscape-view-utilities');
var Promise = require('bluebird');
var jQuery = global.jQuery = require('jquery');
var cyqtip = require('cytoscape-qtip');
var shell = require('electron').shell;
var nodeConsole = require('console');

//jQuery.qtip = require('qtip2');
//cyqtip(cytoscape, jQuery); // register extension

document.addEventListener('DOMContentLoaded', function() {
//var cy = window.cy = cytoscape({
//    container: document.getElementById('cy'),
//    layout: {name: 'breadthfirst', directed: true},
//    style: [{
//        selector: 'node',
//        css: {
//            'label': 'data(id)'
//        }
//    }
//    ],
//    elements: {
//        nodes: [//{
//            //data: {
//            {"data": {"id": "market vendor", "label": "5211.1", "href": "http://data.europa.eu/esco/occupation/c822ca35-6c36-4eab-97fa-90f2775091c3"}},
//            {"data": {"id": "Stall and market salespersons", "label": "5211", "href": "http://data.europa.eu/esco/isco/C5211"}},
//            {"data": {"id": "Street and market salespersons", "label": "521", "href": "http://data.europa.eu/esco/isco/C521"}},
//            {"data": {"id": "Sales workers", "label": "52", "href": "http://data.europa.eu/esco/isco/C52"}},
//            {"data": {"id": "Service and sales workers", "label": "5", "href": "http://data.europa.eu/esco/isco/C5"}},
//            {"data":{"id": "Personal service workers", "label": '51', "href": "http://data.europa.eu/esco/isco/C51"}},
//            {"data":{"id": "Personal care workers", "label": '53', "href": "http://data.europa.eu/esco/isco/C53"}},
//            {"data":{"id": "Protective services workers", "label": '54', "href": "http://data.europa.eu/esco/isco/C54"}},
//            //{ "data": {"id":"precision mechanic", "label":'7222.4',"href":'http://data.europa.eu/esco/occupation/d1974e0c-8f92-473b-a32d-f0616c08b1ff'}},

//        ],
//        edges: [
            //{
//            {"data": {"id": 4, "source": "Service and sales workers", "target": "Sales workers"}},
//            {"data": {"id": 5, "source": "Service and sales workers", "target": "Personal service workers"}},
//            {"data": {"id": 6, "source": "Service and sales workers", "target": "Personal care workers"}},
//            {"data": {"id": 7, "source": "Service and sales workers", "target": "Protective services workers"}},
//            {"data": {"id": 3, "source": "Sales workers", "target": "Street and market salespersons"}},
//            {"data": {"id": 2, "source": "Street and market salespersons", "target": "Stall and market salespersons"}},
//            {"data": {"id": 1, "source": "Stall and market salespersons", "target": "market vendor"}},
//        ]
//    }
//});
//var instance = cy.viewUtilities();
// store all the nodes in variable
    //populating childrenDat
//var nodes = cy.elements.nodes;

//cy.nodes('[id = "market vendor"]').style('background-color', 'purple');
//instance.hide(cy.elements().difference(cy.getElementById('Service and sales workers').closedNeighborhood("id='Personal service workers'")));
//instance a cacher
//instance.hide(cy.getElementById('Personal care workers'));
//instance.hide(cy.getElementById('Personal service workers'));
//instance.hide(cy.getElementById("Protective services workers"));
//var nodes_v = ['banana'];

// definition d'une liste comportant les labels
// des noeuds ne devant pas être supprimé <=> noeuds appartenant à la branche du
// noeud étudié
//var family_nodes = ['5','52','521','5211','5211.1'];

// fonction permettant les actions lors de la sélection de noeud
// par l'utilisateur
//cy.on('tap', 'node', function(event){
    //affiche les neouds voisins (cachés) du noeud sélectioné
    // enregistre dans une liste les noeuds qui ont été coché
//    var myConsole = new nodeConsole.Console(process.stdout, process.stderr);
    //instance.show(event.target.neighborhood());
    //myConsole.log('test 1 2');
    //myConsole.log(nodes_v);
//    if (nodes_v.includes(event.target.id())==true) {
//        instance.hide(event.target.neighborhood());
//        var neighbor_nodes = event.target.neighborhood();
//        for (var x = 0; x < neighbor_nodes.length; x++){
//            if(family_nodes.includes(neighbor_nodes[x]._private.data.label)){
                //myConsole.log(neighbor_nodes[x]._private.data.label);
//                instance.show(neighbor_nodes[x]);
//            }
//            else{
                //myConsole.log('edge neighbor');
                //myConsole.log(neighbor_nodes[x]._private);

//            }
//        };
        //myConsole.log(neighbor_nodes[4]._private.data.label);
        // return nodes_v without the last element clicked by the user
//        nodes_v = nodes_v.filter(function(e) { return e !== event.target.id() });
        //myConsole.log(nodes_v);
//    }
//    else {
//        instance.show(event.target.neighborhood());
//        nodes_v.push(event.target.id());
//    }
//});

var myConsole = new nodeConsole.Console(process.stdout, process.stderr);

// script pour rappeler toute la branche d'ESCO depuis un uri d'une occupation
// Initialisation 0 :
// recupération des données de l'occupation
var nodes = [];
var edges = [];
var xhReq = new XMLHttpRequest();
xhReq.open("GET", 'http://ec.europa.eu/esco/api/resource/occupation/?language=en&uri=http://data.europa.eu/esco/occupation/d1974e0c-8f92-473b-a32d-f0616c08b1ff', false);
//xhReq.open("GET",'http://ec.europa.eu/esco/api/resource/occupation/?language=en&uri=http://data.europa.eu/esco/occupation/b5f6bb2c-0602-484d-a87f-9cac33f83010', false);
//xhReq.open("GET",'http://ec.europa.eu/esco/api/resource/occupation/?language=en&uri=http://data.europa.eu/esco/occupation/c822ca35-6c36-4eab-97fa-90f2775091c3', false);
//xhReq.open("GET", 'http://ec.europa.eu/esco/api/resource/occupation/?language=en&uri=http://data.europa.eu/esco/occupation/123a195c-103a-4b84-b3fd-6d40dbc15c54', false);
xhReq.send(null);
var jsonObject = JSON.parse(xhReq.responseText);
//myConsole.log(jsonObject['uri']);
var count = 0;

// créer liste des noueds  de la branche principale
var family_tree_label = [];

// creer ensemble des noeuds à partir du json reçu par api
nodes.push({
    data:{
        id: jsonObject['title'], //'son', //jsonObject['title'],
        //color: "#c4274c",
        name: jsonObject['title'],
        shape: 'rectangle',
        label: jsonObject['code'],
        go: [],
        href: jsonObject['uri']

    }
});
family_tree_label.push(jsonObject['code']);


// Loop : Tant qu'il ya un groupe isco ou un concept parent on récupère l'uri de ce parent
while (jsonObject['_links']['broaderOccupation'] || jsonObject['_links']['broaderIscoGroup'] != undefined || jsonObject['_links']['broaderConcept']){
    count = count + 1;
    var xhReq = new XMLHttpRequest();
    if(jsonObject['_links']['broaderIscoGroup'] != undefined){
        // appel API de la classe parent de l'occupation
        var uri = 'http://ec.europa.eu/esco/api/resource/occupation/?language=en&uri='+jsonObject['_links']['broaderIscoGroup'][0]['uri'];
        xhReq.open("GET", uri, false);
        xhReq.send(null);
        // on enregistre les données du json du noeud précédent dans jsonObject_old
        var jsonObject_old = jsonObject;
        var jsonObject = JSON.parse(xhReq.responseText);
        family_tree_label.push(jsonObject['code']);
        myConsole.log('coucou dans 1ere boucle');
        myConsole.log(jsonObject['_links']['narrowerOccupation']);
        if(count==1){
            // définition de l'attribut 'go' présent dans la définition du node
            // on est ici à la première itération soit le niveau juste au-dessus de l'occupation étudiée
            // par conséquent on appelle les uri des narrowerOccupation qui correspondent donc aux occupations frères de
            // l'occupation étudiée
            var go = [];
            for (x = 0; x < jsonObject['_links']['narrowerOccupation'].length; x++) {
                go.push(jsonObject['_links']['narrowerOccupation'][x]['uri']);
            };
            //ajout dans la liste de nodes des données du noeud de la classe parent
            // les données nécessaires sont récupérées depuis le json récupéré par API
            nodes.push({
                data:{
                    id: jsonObject['title'],
                    name: jsonObject['title'],
                    shape: 'triangle',
                    label: jsonObject['code'],
                    go: go,
                    href: jsonObject['uri']
                }
            });
            // ajout arrêt entre la classe supérieur et le noeud d'occupation étudié
            edges.push({
                data: {
                    source: jsonObject['title'],
                    target: jsonObject_old['title'] //'son'
                }
            });
        }
        //
        else{
            nodes.push({
                data:{
                    id: jsonObject['title'],
                    name: jsonObject['title'],
                    shape: 'triangle',
                    label: jsonObject['code'],
                    go: [],
                    href: jsonObject['uri']
                }
            });
            edges.push({
                data: {
                    source: jsonObject['title'],
                    target: jsonObject_old['title']
                }
            });
        }
    }
    else if(jsonObject['_links']['broaderOccupation'] != undefined){
        // appel API de la classe parent de l'occupation
        var uri = 'http://ec.europa.eu/esco/api/resource/occupation/?language=en&uri='+jsonObject['_links']['broaderOccupation'][0]['uri'];
        xhReq.open("GET", uri, false);
        xhReq.send(null);
        // on enregistre les données du json du noeud précédent dans jsonObject_old
        var jsonObject_old = jsonObject;
        var jsonObject = JSON.parse(xhReq.responseText);
        family_tree_label.push(jsonObject['code']);
        myConsole.log('coucou dans 1ere boucle');
        myConsole.log(jsonObject['_links']['narrowerOccupation']);
        if(count==1){
            // définition de l'attribut 'go' présent dans la définition du node
            // on est ici à la première itération soit le niveau juste au-dessus de l'occupation étudiée
            // par conséquent on appelle les uri des narrowerOccupation qui correspondent donc aux occupations frères de
            // l'occupation étudiée
            var go = [];
            for (x = 0; x < jsonObject['_links']['narrowerOccupation'].length; x++) {
                go.push(jsonObject['_links']['narrowerOccupation'][x]['uri']);
            };
            //ajout dans la liste de nodes des données du noeud de la classe parent
            // les données nécessaires sont récupérées depuis le json récupéré par API
            nodes.push({
                data:{
                    id: jsonObject['title'],
                    name: jsonObject['title'],
                    shape: 'triangle',
                    label: jsonObject['code'],
                    go: go,
                    href: jsonObject['uri']
                }
            });
            // ajout arrêt entre la classe supérieur et le noeud d'occupation étudié
            edges.push({
                data: {
                    source: jsonObject['title'],
                    target: jsonObject_old['title'] //'son'
                }
            });
        }
        //
        else{
            nodes.push({
                data:{
                    id: jsonObject['title'],
                    name: jsonObject['title'],
                    shape: 'triangle',
                    label: jsonObject['code'],
                    go: [],
                    href: jsonObject['uri']
                }
            });
            edges.push({
                data: {
                    source: jsonObject['title'],
                    target: jsonObject_old['title']
                }
            });
        }
    }
    // on n'est plus sûr le niveau supérieur d'une occupation, mais sur le niveau supérieur d'une classe
    else {
        // appel de la classe supérieur "broaderConcept"
        var uri = 'http://ec.europa.eu/esco/api/resource/occupation/?language=en&uri=' + jsonObject['_links']['broaderConcept'][0]['uri'];
        xhReq.open("GET", uri, false);
        xhReq.send(null);
        var jsonObject_old = jsonObject;
        var jsonObject = JSON.parse(xhReq.responseText);
        family_tree_label.push(jsonObject['code']);
        var go = [];
        if (jsonObject['_links']['narrowerConcept'] != undefined ) {
            for (x = 0; x < jsonObject['_links']['narrowerConcept'].length; x++){
                go.push(jsonObject['_links']['narrowerConcept'][x]['uri']);
            };
            nodes.push({
                data: {
                    id: jsonObject['title'],
                    name: jsonObject['title'],
                    shape: 'triangle',
                    go: go,
                    label: jsonObject['code'],
                    href: jsonObject['uri']

                }
            });
        }
        else{
            myConsole.log('coucou');
            myConsole.log(jsonObject['_links']['narrowerConcept']);
            nodes.push({
                data: {
                    id: jsonObject['title'],
                    name: jsonObject['title'],
                    shape: 'triangle',
                    label: jsonObject['code'],
                    go: [],
                    href: jsonObject['uri']

                }
            });
        }
        edges.push({
            data: {
                source: jsonObject['title'],
                target: jsonObject_old['title']

            }
        });

    }

}
myConsole.log(family_tree_label);
//myConsole.log(nodes);
//myConsole.log(edges);

var cy = window.cy = cytoscape({
    container: document.getElementById('cy'),
    layout: {name: 'breadthfirst', directed: true},
    style: [{
        selector: 'node',
        css: {
            'color': '#0172fd',
            'shape': 'rectangle',
            'content': 'data(name)'
        }
    }
    ],
    elements: {
        nodes: nodes,
        edges: edges,
    }
});

//
var instance = cy.viewUtilities();
// couleur distincte pour le noued d'occupation étudié
cy.nodes('[shape = "rectangle"]').style('background-color', '#ba01fd');
// couleur distincte pour les noueds de la branche principale
cy.nodes('[shape = "triangle"]').style('background-color','green');


var list_on_click=[];
var list_node_been_dep=[];
cy.on('tap', 'node', function(event){
    if(list_node_been_dep.includes(event.target.id())==false){
        for(x=0;x<this.data('go').length;x++){
            //myConsole.log('clicked ' + this.data('go')[x] );
            var xhReq = new XMLHttpRequest();
            xhReq.open("GET", 'http://ec.europa.eu/esco/api/resource/occupation/?language=en&uri='+this.data('go')[x], false);
            xhReq.send(null);
            var jsonObject_1 = JSON.parse(xhReq.responseText);
            cy.add([
                {group: "nodes", data: {
                    id: jsonObject_1['title'],
                        name: jsonObject_1['title'],
                        go: [],
                        label: jsonObject_1['code'],
                        href: jsonObject_1['uri']}},
                {group: "edges", data: {
                    id: this.data('label')+x,
                        source: this.data('id'),
                        target: jsonObject_1['title']}}
                        ]);
        //    { group: "edges", data: { id: a[i]+b[0], source: a[i], target: b[0]},...}
        //])
        };
    //var go_new = [];
    //this.data('go') = go_new;
        function refreshLayout() {
            var layout = cy.layout({ name: 'breadthfirst' });
            layout.stop();
            layout = cy.elements().makeLayout({name: 'breadthfirst', directed: true});
            layout.run();
        };
        refreshLayout();
        list_node_been_dep.push(event.target.id());
        list_on_click.push(event.target.id());
    }
    else{
        if(list_on_click.includes(event.target.id())==false){
            //myConsole.log('deja deployé');
            instance.show(event.target.neighborhood());
            list_on_click.push(event.target.id());
            // ici appliquer script pour cacher les noeuds voinsins du noued sélectionné n'appartenant pas à l'arborescence principale

        }
        else{
            //myConsole.log('deja deployé');
            instance.hide(event.target.neighborhood());
            var neighbor_nodes = event.target.neighborhood();
            for (var x = 0; x < neighbor_nodes.length; x++){
                if(family_tree_label.includes(neighbor_nodes[x]._private.data.label)){
                //myConsole.log(neighbor_nodes[x]._private.data.label);
                    instance.show(neighbor_nodes[x]);
                }
                else{
                //myConsole.log('edge neighbor');
                //myConsole.log(neighbor_nodes[x]._private);
                }
            };
            // méthode pour retirer l'élément cliqué de la liste des noeuds ayant été ouverts
            const index = list_on_click.indexOf(event.target.id());
            if (index > -1) {
                list_on_click.splice(index, 1);
            };
            // fin méthode
        }
    }
    //myConsole.log(list_on_click);

});

cy.on('mouseover', 'node', function(event) {
    var node = event.target;
    myConsole.log('mouse on node' + node.data('label'));
});


});








