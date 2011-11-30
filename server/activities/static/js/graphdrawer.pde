var GE = GraphEditor;

class Node{
  boolean visible, selected;
  float posx, posy;
  float radius;
  float selectedExpansion = 1.5;
  boolean finalNode;
  String name;
  Relation[] relations;

  Node(float x, float y, float r, String n){
    posx = x;
    posy = y;
    radius = r;
    name = n;
    visible = true;
    relations = {};
  }

  void drawMe(){
    if (visible){
      for(int i=0;i<relations.length;i++){
        if (relations[i].getNode().isVisible()){
          relations[i].drawMe();
        }
      }
      stroke(#999999);
      noFill();
      if (selected){
        ellipse(posx, posy, radius*2*selectedExpansion, radius*2*selectedExpansion);
      } else {
        ellipse(posx, posy, radius*2, radius*2);
      }
      fill(#E5FDCB);
      text(name, posx, posy);
      strokeWeight(1);
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

  boolean hasEdge(type, target){
    for(int i=0;i<relations.length;i++){
      if (relations[i].getType()==type && relations[i].getNode()==target){
        return true;
      }
    }
    return false;
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
  }

  boolean isFinal(){
    return finalNode;
  }

  Relation[] getRelations(){
    return relations;
  }

  void removeRelation(int n){
    Relation[] temp = {};
    for(int i=0;i<relations;i++){
      if (i!=n){
        temp = append(temp, relations[i]);
      }
    }
    relations = temp;
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
    stroke(#999999);
    line(source.getX(), source.getY(), target.getX(), target.getY());
    noStroke();
    fill(#E5FDCB);
    text(type, (source.getX()+target.getX())/2, (source.getY()+target.getY())/2);

  }
}


float nodeRadius;
float scale = 2;
Node[] _nodeList = {};
Node[] _tempList = {};
var graphNodes;
var graphEdges;

Node getNode(nodeName) {
  for(int i=0;i<_nodeList.length;i++){
    if (_nodeList[i].getName()==nodeName){
      return _nodeList[i];
    }
  }
}

void setup() {
  var GE = GraphEditor;
  float drawableWidth, drawableHeight;
  Node newNode;
  Relation newRelation;
  drawableWidth = document.innerWidth*0.9;
  drawableHeight = document.innerHeight*0.75;
  size(800,300);
  stroke(0);
  noStroke();
  nodeRadius = 20;
  PFont fontA = loadFont("Courier New");  
  textFont(fontA, 16);  
  textAlign(CENTER);
  graphNodes = GE.getGraphNodesJSON();
  for (var i in graphNodes){
    newNode = new Node(random(width), random(height), nodeRadius, i);
    _nodeList = append(_nodeList, newNode);
  }
  graphEdges = GE.getGraphEdgesJSON();
  for(var i=0;i<graphEdges.length;i++){
    var edge = graphEdges[i];
    newRelation = new Relation(getNode(edge["source"]), edge["type"], getNode(edge["target"]));
    getNode(edge["source"]).addRelation(newRelation);
  }
}


void draw(){
  background(#417690);

  // Get nodes from form
  graphNodes = GE.getGraphNodesJSON();

  // Add new nodes if any
  for (var i in graphNodes){
    if (getNode(i)==null) {
      newNode = new Node(random(width), random(height), nodeRadius, i);
      _nodeList = append(_nodeList, newNode);
    }
  }

  // Remove deleted nodes if any
  _tempList = {};
  for(int i=0;i<_nodeList.length;i++){
    if (graphNodes.hasOwnProperty(_nodeList[i].getName())){
      _tempList = append(_tempList, _nodeList[i]);
    }
  }
  _nodeList = {};
  for(int i=0;i<_tempList.length;i++){
    _nodeList = append(_nodeList, _tempList[i]);
  }

  checkChanges();

  if (mousePressed) {
    for(int i=0;i<_nodeList.length;i++){
      if (_nodeList[i].touchingMe(mouseX, mouseY)){
        unselectAll();
        _nodeList[i].setSelected();
        _nodeList[i].setX(mouseX);
        _nodeList[i].setY(mouseY);
        _nodeSelected = i;
        break;
      }
    }
  } else {
    unselectAll();
  }
  for(int i=0;i<_nodeList.length;i++){
    _nodeList[i].drawMe();
  }
}

void unselectAll(){
  for(int i=0;i<_nodeList.length;i++){
    _nodeList[i].setUnselected();
  }
}

void checkChanges(){
  // Get edges from form
  graphEdges = GE.getGraphEdgesJSON();

  // Add new edges if any
  Node _source, _target;
  for(int i=0;i<graphEdges.length;i++){
    var edge = graphEdges[i];
    _source = getNode(edge["source"]);
    _target = getNode(edge["target"]);
    if (!_source.hasEdge(edge["type"], _target)){
        Relation newRelation = new Relation(_source, edge["type"], _target);
        _source.addRelation(newRelation);
    }
  }

  //Remove edges if any
  boolean found;
  Relation[] tempTable;
  for(int i=0;i<_nodeList.length;i++){
    tempTable = _nodeList[i].getRelations();
    for(int j=0;j<tempTable.length;j++){
      found = false
      for(int k=0;k<graphEdges.length;k++){
        var edge = graphEdges[k];
        if ((_nodeList[i].getName() == edge["source"]) &&
                  (tempTable[j].getType() == edge["type"]) &&
                  (tempTable[j].getNode().getName() == edge["target"])) {
          found = true;
        }
      }
      if (!found){
        _nodeList[i].removeRelation(j);
      }
    }
  }

}