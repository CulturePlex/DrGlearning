// Global parameters
int WIDTH = 900;
int HEIGHT = 800;
int GRID_SPACING = 15;
float objectScale = 4;
boolean _showLabels = true;

float SCALING_STEP = 0.1;
float PANNING_STEP = 5;

float MIN_SCALING = 0.1;
float MAX_SCALING = 4.5;

float MIN_PANNING = -10000;
float MAX_PANNING = 10000;

// Taken from http://www.hitmill.com/html/pastels2.html
color[] COLORS = {#F70000, #B9264F, #990099, #74138C, #0000CE, #1F88A7, #4A9586, #FF2626,
#D73E68, #B300B3, #8D18AB, #5B5BFF, #25A0C5, #5EAE9E, #FF5353,
#DD597D, #CA00CA, #A41CC6, #7373FF, #29AFD6, #74BAAC,
#FF7373, #E37795, #D900D9, #BA21E0, #8282FF, #4FBDDD, #8DC7BB,
#FF8E8E, #E994AB, #FF2DFF, #CB59E8, #9191FF, #67C7E2, #A5D3CA,
#FFA4A4, #EDA9BC, #F206FF, #CB59E8, #A8A8FF, #8ED6EA, #C0E0DA,
#FFB5B5, #F0B9C8, #FF7DFF, #D881ED, #B7B7FF, #A6DEEE, #CFE7E2,
#FFC8C8, #F4CAD6, #FFA8FF, #EFCDF8, #C6C6FF, #C0E7F3, #DCEDEA,
#FFEAEA, #F8DAE2, #FFC4FF, #EFCDF8, #DBDBFF, #D8F0F8, #E7F3F1,
#FFEAEA, #FAE7EC, #FFE3FF, #F8E9FC, #EEEEFF, #EFF9FC, #F2F9F8,
#FFFDFD, #FEFAFB, #FFFDFF, #FFFFFF, #FDFDFF, #FAFDFE, #F7FBFA};

class Node{
  boolean visible, selected;
  float posx, posy;
  float xspeed, yspeed;
  float radius;
  float selectedExpansion = 1.1;
  boolean finalNode;
  String name;
  int nodeType = 0;
  ArrayList<Relation> relations;

  Node(float x, float y, String n){
    posx = x;
    posy = y;
    name = n;
    visible = true;
    relations = new ArrayList<Relation>();
    xspeed = 0;
    yspeed = 0;
  }

  void drawMe(){
    if (visible){
      for(int i=0;i<relations.size();i++){
        if (relations.get(i).getNode().isVisible()){
          relations.get(i).drawMe();
        }
      }
      radius = _nodeRadius;
      stroke(#999999);
      fill(COLORS[nodeType]);
      if (selected){
        ellipse(posx, posy, radius*2*selectedExpansion, radius*2*selectedExpansion);
      } else {
        ellipse(posx, posy, radius*2, radius*2);
      }
      if (_showLabels){
        fill(0);
        text(name, posx, posy);
        strokeWeight(1);
      }
    }
  }

  boolean touchingMe(float x, float y){
    float transformedPosX, transformedPosY;

    if (!visible) return false;

    transformedPosX = posx * _canvasScale + _canvasXPan;
    transformedPosY = posy * _canvasScale + _canvasYPan;

    if (selected){
      return (dist(transformedPosX, transformedPosY, x, y) < radius*selectedExpansion*_canvasScale);
    } else {
      return (dist(transformedPosX, transformedPosY, x, y) < radius*_canvasScale);
    }
  }

  String getName(){
    return name;
  }

  void setSelected(){
    _nodeSelected=true;
    selected=true;
  }

  void setUnselected(){
    selected=false;
  }

  void addRelation(Relation r){
    relations.add(r);
  }

  boolean isVisible(){
    return visible;
  }

  boolean isSelected(){
    return selected;
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

  void setXSpeed(float s){
    xspeed = s;
  }

  float getXSpeed(){
    return xspeed;
  }

  void setYSpeed(float s){
    yspeed = s;
  }

  float getYSpeed(){
    return yspeed;
  }

  void setType(String nt){
    int nodeTypeIndex = 0;
    nodeTypeIndex = _nodeTypes.indexOf(nt);
    if (nodeTypeIndex == -1){
      _nodeTypes.add(nt);
      nodeTypeIndex = _nodeTypes.size() - 1;
    }
    nodeType = nodeTypeIndex;
  }

  String[] getRelationshipTypes(){
    String[] buffer = {};
    for(int i=0;i<relations.size();i++){
      //TODO Remove repeated ones
      buffer = append(buffer, relations.get(i).getType());
    }
    return buffer;
  }

  boolean hasEdge(String type, String target){
    for(int i=0;i<relations.size();i++){
      if (relations.get(i).getType()==type && relations.get(i).getNode().getName()==target){
        return true;
      }
    }
    return false;
  }

  boolean hasAnyEdge(String target){
    for(int i=0;i<relations.size();i++){
      if (relations.get(i).getNode().getName()==target){
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
    for(int i=0;i<relations.size();i++){
      r = relations.get(i);
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

  ArrayList<Relation> getRelations(){
    return relations;
  }

  void removeRelation(String type, String target){
    ArrayList<Relation> temp = new ArrayList<Relation>();
    for(int i=0;i<relations.size();i++){
      if (type!=relations.get(i).getType() || target!=relations.get(i).getNode().getName()){
        temp.add(relations.get(i));
 //       temp = append(temp, (Relation)relations[i]);
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

  //TODO Remove this
  Node getNode(){
    return target;
  }

  String getType(){
    return type;
  }

  Node getSource(){
    return source;
  }

  Node getTarget(){
    return target;
  }

  void drawMe(){
    stroke(0);
    line(source.getX(), source.getY(), target.getX(), target.getY());
    if (_showLabels){
      noStroke();
      fill(0);
      text(type, (source.getX()+target.getX())/2, (source.getY()+target.getY())/2);
    }
  }
}


float _nodeRadius;
boolean _nodeSelected;

float _canvasScale = 1.0;
float _canvasXPan = 0.0;
float _canvasYPan = 0.0;

ArrayList<Node> _nodeList = new ArrayList<Node>();
ArrayList<String> _nodeTypes = new ArrayList();

Node getNode(String nodeName) {
  for(int i=0;i<_nodeList.size();i++){
    if (_nodeList.get(i).getName()==nodeName){
      return _nodeList.get(i);
    }
  }
  return null;
}

void draw_background(gridSpacing) {
  background(#FFFFFF);
  stroke(#EEEEEE);
  for(int i=0;i<width;i+=gridSpacing){
    line(i, 0, i, height);
  }
  for(int i=0;i<height;i+=gridSpacing){
    line(0, i, width, i);
  }
}

void setup() {
  float drawableWidth, drawableHeight;
  Node newNode;
  Relation newRelation;
  size(WIDTH,HEIGHT);
  //frameRate(10);
  smooth();
  stroke(0);
  noStroke();
  _nodeRadius = 20;
  PFont fontA = loadFont("Verdana");  
  textFont(fontA, 8);  
  textAlign(CENTER);
  _nodeTypes.add("notype");
}


void draw(){
  draw_background(GRID_SPACING);

  if (keyPressed || mouseScroll){
    if (mouseScroll == 1) {mouseScroll=0;incScale();}
    if (mouseScroll == -1) {mouseScroll=0;decScale();}
  }

  // Layout algorithm
  spring();

  translate(_canvasXPan, _canvasYPan);
  scale(_canvasScale, _canvasScale);

  _nodeRadius = max(height/(objectScale*_nodeList.size()), 5);

  for(int i=0;i<_nodeList.size();i++){
    _nodeList.get(i).drawMe();
  }

}

void mousePressed(){
  for(int i=0;i<_nodeList.size();i++){
    if (_nodeList.get(i).touchingMe(mouseX, mouseY)){
      unselectAll();
      _nodeList.get(i).setSelected();
      break;
    }
  }
}

void mouseReleased(){
  unselectAll();
  _nodeSelected = false;
}

void mouseDragged(){
  float mouseXtransformed, mouseYtransformed;
  // Pan the canvas if no node is selected

  if (!_nodeSelected){
    if (mouseX > pmouseX) {panLeft();}
    if (mouseX < pmouseX) {panRight();}
    if (mouseY > pmouseY) {panUp();}
    if (mouseY < pmouseY) {panDown();}
    return;
  }

  // Move the selected node
  for(int i=0;i<_nodeList.size();i++){
    if (_nodeList.get(i).isSelected()){
      mouseXtransformed = (mouseX - _canvasXPan) / _canvasScale;
      mouseYtransformed = (mouseY - _canvasYPan) / _canvasScale;
      _nodeList.get(i).setX(mouseXtransformed);
      _nodeList.get(i).setY(mouseYtransformed);
      break;
    }
  }
}

void spring(){
  int margin = 5;
  int N;
  float k, xmove, ymove;
  Node node;
  
  for(int i=0;i<_nodeList.size();i++){
    node = _nodeList.get(i);
    node.setXSpeed(0);
    node.setYSpeed(0);
  }
  N = _nodeList.size();
  k = Math.sqrt(height*width/N);
  for(int i=0;i<_nodeList.size();i++){
    for(int j=0;j<_nodeList.size();j++){
      coulombRepulsion(k, _nodeList.get(i), _nodeList.get(j));
    }
  }
  for(int i=0;i<_nodeList.size();i++){
    node = _nodeList.get(i);
    for(int j=0;j<node.getRelations().size();j++){
      hookeAttraction(k, node.getRelations().get(j));
    }
  }
  for(int i=0;i<_nodeList.size();i++){
    node = _nodeList.get(i);
    xmove = 0.001 * node.getXSpeed();
    ymove = 0.001 * node.getYSpeed();
    node.setX(node.getX()+xmove);
    node.setY(node.getY()+ymove);
    if (node.getX() > width) node.setX(width-margin);
    if (node.getX() < margin) node.setX(margin);
    if (node.getY() > height) node.setY(height-margin);
    if (node.getY() < margin) node.setY(margin);
  }
}

void coulombRepulsion(float k, Node n1, Node n2){
  float dx, dy, d, repulsiveForce;
  dx = n2.getX() - n1.getX();
  dy = n2.getY() - n1.getY();
  d = Math.sqrt(dx*dx + dy*dy);
  if (d>0){
    repulsiveForce =  k / d;
    n2.setXSpeed(n2.getXSpeed() + repulsiveForce * dx / d);
    n2.setYSpeed(n2.getYSpeed() + repulsiveForce * dy / d);
    n1.setXSpeed(n1.getXSpeed() - repulsiveForce * dx / d);
    n1.setYSpeed(n1.getYSpeed() - repulsiveForce * dy / d);
  }

}

void hookeAttraction(float k, Relation r){
  float dx, dy, d, attractiveForce;
  Node source, target;
  source = r.getSource();
  target = r.getTarget();
  dx = target.getX() - source.getX();
  dy = target.getY() - source.getY();
  d = dx*dx + dy*dy;
  attractiveForce = d / k;
  d = Math.sqrt(d);
  if (d>0){
    target.setXSpeed(target.getXSpeed() - attractiveForce * dx / d);
    target.setYSpeed(target.getYSpeed() - attractiveForce * dy / d);
    source.setXSpeed(source.getXSpeed() + attractiveForce * dx / d);
    source.setYSpeed(source.getYSpeed() + attractiveForce * dy / d);
  }
}

void unselectAll(){
  for(int i=0;i<_nodeList.size();i++){
    _nodeList.get(i).setUnselected();
  }
}

void addNode(String nodeName, String nodeType){
  Node newNode;
  newNode = new Node(random(width), random(height), nodeName);

  if (nodeType) {
    newNode.setType(nodeType);
  }

  _nodeList.add(newNode);
}

void addLocatedNode(String nodeName, float xpos, float ypos, String nodeType){
  Node newNode;
  float x = width*norm(xpos, -1400, 1400);
  float y = height*norm(ypos, -1000, 1400);
  newNode = new Node(x, y, nodeName);

  if (nodeType) {
    newNode.setType(nodeType);
  }

  _nodeList.add(newNode);
}

void deleteNode(String nodeName){
  ArrayList<Node> tempList = new ArrayList<Node>();
  for(int i=0;i<_nodeList.size();i++){
    if (_nodeList.get(i).getName() != nodeName){
      tempList.add(_nodeList.get(i));
    }
  }
  _nodeList = tempList;
}

void addEdge(String source, String type, String target){
  Relation newRelation = new Relation(getNode(source), type, getNode(target));
  getNode(source).addRelation(newRelation);
}

void deleteEdge(String source, String type, String target){
  Node sourceNode = getNode(source);
  sourceNode.removeRelation(type, target);
}

/* Scaling produces an unwanted behaviour moving the canvas 
  upper-left. This values help keeping the camera centered
*/
float X_CORRECTOR = 10;
float Y_CORRECTOR = 5;

void incScale(){
  _canvasScale += SCALING_STEP;
  _canvasXPan -= X_CORRECTOR*PANNING_STEP;
  _canvasYPan -= Y_CORRECTOR*PANNING_STEP;
  _canvasScale = min(_canvasScale, MAX_SCALING);
}

void decScale(){
  _canvasScale -= SCALING_STEP;
  _canvasXPan += X_CORRECTOR*PANNING_STEP;
  _canvasYPan += Y_CORRECTOR*PANNING_STEP;
  _canvasScale = max(_canvasScale, MIN_SCALING);
}

void setScale(float value){
  _canvasScale = value;
  _canvasScale = min(_canvasScale, MAX_SCALING);
}

void panLeft(){
  _canvasXPan += PANNING_STEP;
  _canvasXPan = min(_canvasXPan, MAX_PANNING);
}

void panRight(){
  _canvasXPan -= PANNING_STEP;
  _canvasXPan = max(_canvasXPan, MIN_PANNING);
}

void panUp(){
  _canvasYPan += PANNING_STEP;
  _canvasYPan = min(_canvasYPan, MAX_PANNING);
}

void panDown(){
  _canvasYPan -= PANNING_STEP;
  _canvasYPan = max(_canvasYPan, MIN_PANNING);
}

void toggleLabels(){
  _showLabels = !_showLabels;
}




void test(){
  addNode("Tolkien");
  addNode("LOTR");
  addNode("Sam");
  addNode("Frodo");
  addNode("Mount Doom");
  addEdge("Tolkien", "wrote", "LOTR");
  addEdge("Frodo", "appears_in", "LOTR");
  addEdge("Sam", "appears_in", "LOTR");
  addEdge("Frodo", "goes_to", "Mount Doom");
  addEdge("Sam", "goes_to", "Mount Doom");
  addNode("Bambi");
  addEdge("Bambi", "appears_in", "LOTR");
  deleteEdge("Bambi", "appears_in", "LOTR");
  deleteNode("Bambi");
}
