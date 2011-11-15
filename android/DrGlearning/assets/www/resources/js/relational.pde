/////////////////////////////
// Javascript functions
/////////////////////////////

function initGraph() {
  // Hide all nodes
  for(var n in graphNodes){
    graphNodes[n]["_visible"] = false;
  }
  // Show the starting point
  addVisitedNode(sourcePath);
  drawGraph(P);
}

function addVisitedNode(node){
  graphNodes[node]["_visible"] = true;
  selectObj = document.getElementById("next-to-expand");
  newOpt = document.createElement("option");
  newOpt.value = node;
  newOpt.text = graphNodes[node]["name"];
  selectObj.add(newOpt, null);
  updateTypes();
}

function getNumberOfNodes(){
  var counter = 0;
  for(var i in graphNodes){
    counter++;
  }
  return counter;
}

function updateTypes(rtypes) {
    var selectObj = document.getElementById("next-type");
    for(i=selectObj.length;i>=0;i--){
        selectObj.remove(i);
    }
    for(var i in rtypes){
      var newOpt = document.createElement("option");
      newOpt.value = rtypes[i];
      newOpt.text = rtypes[i];
      selectObj.add(newOpt);
    }
}

function processAnswer(){
  var typeToCheck = document.getElementById('next-type').value;
  Node selected = _nodeList[_nodeSelected];
  related = selected.getRelated(_answer, typeToCheck);
  if (related!=null){
    related.setVisible(true);
    if (related.isFinal()){
      text("YOU WIN!!!", 20, 20);
      noLoop();
    }
  }
}

/////////////////
//Processing code
/////////////////

class Node{
  boolean visible, selected;
  float posx, posy;
  float radius;
  float selectedExpansion = 1.5;
  float separation = 0.2;
  boolean finalNode;
  String name;
  Relation[] relations;
  // Static precomputed values
  float arc1Start = 0+separation;
  float arc1End = HALF_PI-separation;
  float arc2Start = HALF_PI+separation;
  float arc2End = PI-separation;
  float arc3Start = PI+separation;
  float arc3End = PI+HALF_PI-separation;
  float arc4Start = PI+HALF_PI+separation;
  float arc4End = TWO_PI-separation;
  // Object precomputed values
  float diameter;
  float selectedDiameter;

  Node(float x, float y, float r, String n){
    posx = x;
    posy = y;
    radius = r;
    name = n;
    visible = false;
    selected = false;
    finalNode = false;
    relations = {};
    diameter = 2*radius;
    selectedDiameter = 2*radius*selectedExpansion;
  }

  void drawMe(){
    if (visible){
      noStroke();
      fill(254, 206, 121);
      for(int i=0;i<relations.length;i++){
        if (relations[i].getNode().isVisible()){
          relations[i].drawMe();
        }
      }
      if (selected){
        ellipse(posx, posy, selectedDiameter, selectedDiameter);
        float offset = radians(4*frameCount%360);
        noFill();
        stroke(0);
        strokeWeight(3);
        arc(posx, posy, selectedDiameter, selectedDiameter, arc1Start+offset, arc1End+offset);
        arc(posx, posy, selectedDiameter, selectedDiameter, arc2Start+offset, arc2End+offset);
        arc(posx, posy, selectedDiameter, selectedDiameter, arc3Start+offset, arc3End+offset);
        arc(posx, posy, selectedDiameter, selectedDiameter, arc4Start+offset, arc4End+offset);
      } else {
        ellipse(posx, posy, diameter, diameter);
      }
      fill(0);
      text(name, posx, posy);
    }
  }

  boolean touchingMe(float x, float y){
    if (!visible) return false;
    if (selected){
      return (dist(posx, posy, x, y) < radius*selectedExpansion);
    } else {
      return (dist(posx, posy, x, y) < radius);
    }
  }

  String getName(){
    return name;
  }

  void setSelected(){
    selected=true;
  }

  void setUnselected(){
    selected=false;
  }

  void addRelation(Relation r){
    relations = append(relations, r);
  }

  void isVisible(){
    return visible;
  }

  float getX(){
    return posx;
  }

  void setX(float x){
    posx=x;
  }

  float getY(){
    return posy;
  }

  void setY(float y){
    posy=y;
  }

  String[] getRelationshipTypes(){
    String[] buffer = {};
    for(int i=0;i<relations.length;i++){
      //TODO Remove repeated ones
      buffer = append(buffer, relations[i].getType());
    }
    return buffer;
  }

  void setVisible(boolean b){
    visible=b;
  }

  Node getRelated(String n, String t){
    Relation r;
    for(int i=0;i<relations.length;i++){
      r = relations[i];
      if ((r.getType()==t) && (r.getNode().getName()==n)){
        return r.getNode();
      }
    }
    return null;
  }

  void setAsFinal(){
    finalNode=true;
    visible=true;
  }

  boolean isFinal(){
    return finalNode;
  }
}

class Relation{
  String type;
  Node source;
  Node target;

  Relation(Node sNode, String t, Node tNode){
    source=sNode;
    type=t;
    target=tNode;
  }

  Node getNode(){
    return target;
  }

  String getType(){
    return type;
  }

  void drawMe(){
    stroke(255);
    line(source.getX(), source.getY(), target.getX(), target.getY());
    noStroke();
  }
}


float nodeRadius;
float scale = 2;
int _nodeSelected = 0;
Node[] _nodeList = {};
String _lastAnswer, _answer;

void setup() {
  float drawableWidth, drawableHeight;
  Node newNode;
  Relation newRelation;
  //drawableWidth = window.innerWidth*0.8;
  //drawableHeight = window.innerHeight*0.8;
  //size(drawableWidth, drawableHeight);
  size(200, 200);
  frameRate(10);
  stroke(0);
  noStroke();
  nodeRadius = width/(scale*getNumberOfNodes());
  for (var i in graphNodes){
    newNode = new Node(random(width), random(height), nodeRadius, graphNodes[i]["name"]);
    _nodeList = append(_nodeList, newNode);
    graphNodes[i] = newNode;
  }
  graphNodes[targetPath].setAsFinal();
  for(var i in graphEdges){
    var edge = graphEdges[i];
    var sourceNode = graphNodes[edge["source"]];
    var targetNode = graphNodes[edge["target"]];
    var type = edge["properties"]["type"];
    newRelation = new Relation(sourceNode, type, targetNode);
    sourceNode.addRelation(newRelation);
  }
  _nodeList[0].setVisible(true);
  _nodeList[0].setSelected();
  updateTypes(_nodeList[0].getRelationshipTypes());
  _lastAnswer = "";
  _answer = "";
}


void draw(){
  background(189, 81, 94);
  if ((mouseX!=pmouseX) || (mouseY!=pmouseY)) {
    for(int i=0;i<_nodeList.length;i++){
      if (_nodeList[i].touchingMe(mouseX, mouseY)){
        unselectAll();
        _nodeList[i].setSelected();
        _nodeList[i].setX(mouseX);
        _nodeList[i].setY(mouseY);
        _nodeSelected = i;
        updateTypes(_nodeList[i].getRelationshipTypes());
        _lastAnswer="";
        break;
      }
    }
  }
  for(int i=0;i<_nodeList.length;i++){
    _nodeList[i].drawMe();
  }
  _answer = answer;
  if (_answer!=_lastAnswer){
    _lastAnswer = _answer;
    processAnswer();
  }
}

void unselectAll(){
  for(int i=0;i<_nodeList.length;i++){
    _nodeList[i].setUnselected();
  }
}
