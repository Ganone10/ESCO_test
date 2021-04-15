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
    var elems = {
        nodes: [//{
            //data: {
            {data: {"id": "market vendor", "label": "5211.1", "href": "http://data.europa.eu/esco/occupation/c822ca35-6c36-4eab-97fa-90f2775091c3"}},
            {data: {"id": "Stall and market salespersons", "label": "5211", "href": "http://data.europa.eu/esco/isco/C5211"}},
            {data: {"id": "Street and market salespersons", "label": "521", "href": "http://data.europa.eu/esco/isco/C521"}},
            {data: {"id": "Sales workers", "label": "52", "href": "http://data.europa.eu/esco/isco/C52"}},
            {data: {"id": "Service and sales workers", "label": "5", "href": "http://data.europa.eu/esco/isco/C5"}},
            {data:{"id": "Personal service workers", "label": "51"}},
            {data:{"id": "Personal care workers", "label": "53"}},
            {data:{"id": "Protective services workers", "label": "54"}},
        ],
        edges: [
            //{
            {data: {"id": 4, "source": "Service and sales workers", "target": "Sales workers"}},
            {data: {"id": 5, "source": "Service and sales workers", "target": "Personal service workers"}},
            {data: {"id": 6, "source": "Service and sales workers", "target": "Personal care workers"}},
            {data: {"id": 7, "source": "Service and sales workers", "target": "Protective services workers"}},
            {data: {"id": 3, "source": "Sales workers", "target": "Street and market salespersons"}},
            {data: {"id": 2, "source": "Street and market salespersons", "target": "Stall and market salespersons"}},
            {data: {"id": 1, "source": "Stall and market salespersons", "target": "market vendor"}},
        ]
    }

var childrenData = new Map(); //holds nodes' children info for restoration

var cy = cytoscape({
    container: document.getElementById('cy'),
    autounselectify: true,
    style: [
        {"selector":"core","style":
                {"selection-box-color":"#AAD8FF","selection-box-border-color":"#8BB0D0","selection-box-opacity":"0.5"}
        },
        {"selector":"node","style":
                {"width":"118px","height":"100px","content":"data(id)","font-size":"24px","text-valign":"center","text-halign":"center","background-color":"#555","text-outline-color":"#555","text-outline-width":"2px","color":"#fff","overlay-padding":"6px","z-index":"10"}
        },
        {"selector":"node[?attr]","style":
                {"shape":"rectangle","background-color":"#aaa","text-outline-color":"#aaa","width":"16px","height":"16px","font-size":"6px","z-index":"1"}
        },
        {"selector":"node:selected","style":
                {"border-width":"6px","border-color":"#AAD8FF","border-opacity":"0.5","background-color":"#77828C","text-outline-color":"#77828C"}
        },
        {"selector":"edge","style":
                {"curve-style":"haystack","haystack-radius":"0","opacity":"0.4","line-color":"#bbb","width": "10px","overlay-padding":"3px"}
        }
    ],
    elements: elems,
    layout: {
        name: 'breadthfirst',
        directed: true,
        padding: 10
    }
});

//populating childrenData
var nodes = elems.nodes
for(var x = 0; x < nodes.length; x++){
    var curNode = cy.$("#" + nodes[x].data.id);
    var id = curNode.data('id');
    //get its connectedEdges and connectedNodes
    var connectedEdges = curNode.connectedEdges(function(){
        //filter on connectedEdges
        return !curNode.target().anySame( curNode );
    });
    var connectedNodes = connectedEdges.targets();
    //and store that in childrenData
    //removed is true because all children are removed at the start of the graph
    childrenData.set(id, {data:connectedNodes.union(connectedEdges), removed: true});
}
//recursively removing all children of the Start node (all nodes but the Start node will be removed)
recursivelyRemove(nodes[0].data.id, cy.$("#" + nodes[0].data.id));
//replacing just the first level nodes
childrenData.get(nodes[0].data.id).data.restore();
childrenData.get(nodes[0].data.id).removed = false;
//var instance = cy.viewUtilities();
//removes and restores nodes' children on click
//recursively removes all children of the given node
function recursivelyRemove(id,nodes){
    //nodes is the starting node where the recursion starts
    var toRemove = [];
    //for loop that runs forever until a break or return, similiar to while true loop
    for(;;){
        //setting removed to true for every node (every child, recursively down)
        nodes.forEach(function(node){
            childrenData.get(node.data('id')).removed = true;
        });

        var connectedEdges = nodes.connectedEdges(function(el){
            //getting connectedEdges from all the nodes that only go down the tree
            //aka not keeping edges where their target is a node in the current group of nodes
            return !el.target().anySame( nodes );
        });

        var connectedNodes = connectedEdges.targets();
        //pushing the nodes at the end of those edges (targets) onto toRemove array
        Array.prototype.push.apply( toRemove, connectedNodes );
        //new set of nodes for next iteration is connectedNodes
        nodes = connectedNodes;
        //breaks out of loop if nodes is empty, meaning the last set of nodes had no further children
        if( nodes.empty() ){ break; }
        //otherwise loops again, using the newly collected connectedNodes
        }
        for( var i = toRemove.length - 1; i >= 0; i-- ){
            //removing those nodes (and associated edges)
            toRemove[i].remove();
        }
};

cy.on('tap', 'node', function(){
    var nodes = this;
    var id = nodes.data('id')
    //if the node's children have been removed
    if (childrenData.get(id).removed == true){
        //restore the nodes and edges stored there
        childrenData.get(id).data.restore();
        //set removed to false
        childrenData.get(id).removed = false;
    } else {
        //removed the children nodes and edges recursively
        recursivelyRemove(id,nodes);
    }
    });
});






