(()=>{"use strict";var t,e,i,s;!function(t){t[t.MOUSEEVENT=0]="MOUSEEVENT",t[t.MOUSEDOWN=1]="MOUSEDOWN",t[t.MOUSEUP=2]="MOUSEUP",t[t.MOUSEMOVE=3]="MOUSEMOVE",t[t.MOUSEDRAG=4]="MOUSEDRAG",t[t.KEYBOARDEVENT=5]="KEYBOARDEVENT",t[t.KEYUP=6]="KEYUP",t[t.KEYDOWN=7]="KEYDOWN",t[t.KEYPRESS=8]="KEYPRESS"}(t||(t={}));class r{constructor(e=!1,i=!1,s=!1,r=t.MOUSEEVENT){this.altKey=e,this.ctrlKey=i,this.shiftKey=s,this.type=r}}class a extends r{constructor(e,i,s,r=!1,a=!1,n=!1){super(r,a,n,t.KEYBOARDEVENT),this.key=e,this.keyCode=i,this.repeat=s}}class n{constructor(t=1,e=0,i=0,s=1,r=0,a=0){this.values=new Float32Array([t,e,i,s,r,a])}static create(t=1,e=0,i=0,s=1,r=0,a=0){return new n(t,e,i,s,r,a)}static copy(t,e=null){return null===e&&(e=new n),e.values[0]=t.values[0],e.values[1]=t.values[1],e.values[2]=t.values[2],e.values[3]=t.values[3],e.values[4]=t.values[4],e.values[5]=t.values[5],e}static multiply(t,e,i=null){null===i&&(i=new n);let s=t.values[0],r=t.values[1],a=t.values[2],h=t.values[3],o=t.values[4],l=t.values[5],d=e.values[0],u=e.values[1],c=e.values[2],p=e.values[3],v=e.values[4],g=e.values[5];return i.values[0]=s*d+a*u,i.values[1]=r*d+h*u,i.values[2]=s*c+a*p,i.values[3]=r*c+h*p,i.values[4]=s*v+a*g+o,i.values[5]=r*v+h*g+l,i}static determinant(t){return t.values[0]*t.values[3]-t.values[1]*t.values[2]}static invert(t,e){let i=n.determinant(t);return!h.isEquals(i,0)&&(i=1/i,e.values[0]=t.values[3]*i,e.values[1]=-t.values[1]*i,e.values[2]=-t.values[2]*i,e.values[3]=t.values[0]*i,e.values[4]=(t.values[2]*t.values[5]-t.values[3]*t.values[4])*i,e.values[5]=(t.values[1]*t.values[4]-t.values[0]*t.values[5])*i,!0)}static makeTranslation(t,e,i=null){return null===i&&(i=new n),i.values[0]=1,i.values[1]=0,i.values[2]=0,i.values[3]=1,i.values[4]=t,i.values[5]=e,i}static makeScale(t,e,i=null){return null===i&&(i=new n),i.values[0]=t,i.values[1]=0,i.values[2]=0,i.values[3]=e,i.values[4]=0,i.values[5]=0,i}static makeRotation(t,e=null){null===e&&(e=new n);let i=Math.sin(t),s=Math.cos(t);return e.values[0]=s,e.values[1]=i,e.values[2]=-i,e.values[3]=s,e.values[4]=0,e.values[5]=0,e}static makeRotationFromVectors(t,e,i=!1,s=null){null===s&&(s=new n);let r=o.cosAngle(t,e,i),a=o.sinAngle(t,e,i);return s.values[0]=a,s.values[1]=r,s.values[2]=-a,s.values[3]=r,s.values[4]=0,s.values[5]=0,s}identity(){this.values[0]=1,this.values[1]=0,this.values[2]=0,this.values[3]=1,this.values[4]=0,this.values[5]=0}onlyRotationMatrixInvert(){let t=this.values[1];return this.values[1]=this.values[2],this.values[2]=t,this}}class h{static toRadian(t){return t/180*Math.PI}static toDegree(t){return 180*t/Math.PI}static random(t,e){return t+Math.random()*(e-t)}static isEquals(t,e){return!(Math.abs(t-e)>Number.EPSILON)}static projectPointOnLineSegment(t,e,i,s){let r=o.create(),a=o.create(),n=0;o.difference(t,e,r),o.difference(i,e,a),n=a.normalize();let h=o.dotProduct(r,a);return h<0?(s.x=e.x,s.y=e.y,!1):h>n?(s.x=i.x,s.y=i.y,!1):(o.scaleAdd(e,a,h,s),!0)}static isPointInCircle(t,e,i){return o.difference(e,t).squaredLength<=i*i}static isPointOnLineSegement(t,e,i,s=2){let r=o.create();return!1!==h.projectPointOnLineSegment(t,e,i,r)&&h.isPointInCircle(t,r,s)}static isPointInRect(t,e,i,s,r,a){return t>=i&&t<=i+r&&e>=s&&e<=s+a}static isPointInEllipse(t,e,i,s,r,a){let n=t-i,h=e-s;return n*n/(r*r)+h*h/(a*a)<=1}static sign(t,e,i){let s=o.difference(t,i),r=o.difference(e,i);return o.crossProduct(s,r)}static isPointInTriangle(t,e,i,s){let r=h.sign(e,i,t)<0,a=h.sign(i,s,t)<0,n=h.sign(s,e,t)<0;return r===a&&a===n}static isPointInPolygon(t,e){if(e.length<3)return!1;for(let i=2;i<e.length;i++)if(h.isPointInTriangle(t,e[0],e[i-1],e[i]))return!0;return!1}static isConvex(t){let e,i,s=h.sign(t[0],t[1],t[2])<0;for(let r=1;r<t.length;r++)if(e=(r+1)%t.length,i=(r+2)%t.length,s!==h.sign(t[r],t[e],t[i])<0)return!1;return!0}static transform(t,e,i=null){return null===i&&(i=new o),i.values[0]=t.values[0]*e.values[0]+t.values[2]*e.values[1]+t.values[4],i.values[1]=t.values[1]*e.values[0]+t.values[3]*e.values[1]+t.values[5],i}static getQuadraticBezierPosition(t,e,i,s){if(s<0||s>1)throw alert("t的取值范围必须为[0,1]"),new Error("t的取值范围必须为[0,1]");let r=1-s;return r*r*t+2*s*r*e+s*s*i}static getQuadraticBezierVector(t,e,i,s,r=null){if(s<0||s>1)throw alert("t的取值范围必须为[0,1]"),new Error("t的取值范围必须为[0,1]");return null===r&&(r=new o),r.x=h.getQuadraticBezierPosition(t.x,e.x,i.x,s),r.y=h.getQuadraticBezierPosition(t.y,e.y,i.y,s),r}static getCubicBezierPosition(t,e,i,s,r){if(r<0||r>1)throw alert("t的取值范围必须为[0,1]"),new Error("t的取值范围必须为[0,1]");let a=1-r,n=r*r;return a*a*a*t+3*r*a*a*e+3*n*a*i+n*r*s}static getCubicBezierVector(t,e,i,s,r,a=null){if(r<0||r>1)throw alert("t的取值范围必须为[0,1]"),new Error("t的取值范围必须为[0,1]");return null===a&&(a=new o),a.x=h.getCubicBezierPosition(t.x,e.x,i.x,s.x,r),a.y=h.getCubicBezierPosition(t.y,e.y,i.y,s.y,r),a}}h.Colors=["aqua","black","blue","fuchsia","gray","green","lime","maroon","navy","olive","orange","purple","red","silver","teal","white","yellow"],h.matStack=new class{constructor(){this._mats=[],this._mats.push(new n)}get matrix(){if(0===this._mats.length)throw alert("矩阵堆栈为空"),new Error("矩阵堆栈为空");return this._mats[this._mats.length-1]}pushMatrix(){let t=n.copy(this.matrix);this._mats.push(t)}popMatrix(){0!==this._mats.length?this._mats.pop():alert("堆栈为空")}loadIdentity(){this.matrix.identity()}loadMatrix(t){n.copy(t,this.matrix)}multMatrix(t){n.multiply(this.matrix,t,this.matrix)}translate(t=0,e=0){let i=n.makeTranslation(t,e);this.multMatrix(i)}rotate(t=0,e=!0){!1===e&&(t=h.toRadian(t));let i=n.makeRotation(t);this.multMatrix(i)}rotateFrom(t,e,i=!1){let s=n.makeRotationFromVectors(t,e,i);this.multMatrix(s)}scale(t=1,e=1){let i=n.makeScale(t,e);this.multMatrix(i)}invert(){let t=new n;if(!1===n.invert(this.matrix,t))throw alert("堆栈顶部矩阵为奇异矩阵，无法求逆"),new Error("堆栈顶部矩阵为奇异矩阵，无法求逆");return t}};class o{constructor(t=0,e=0){this.values=new Float32Array([t,e])}static create(t=0,e=0){return new o(t,e)}static copy(t,e=null){return null===e&&(e=o.create()),e.values[0]=t.values[0],e.values[1]=t.values[1],e}static sum(t,e,i=null){return null===i&&(i=new o),i.values[0]=t.values[0]+e.values[0],i.values[1]=t.values[1]+e.values[1],i}static difference(t,e,i=null){return null===i&&(i=new o),i.values[0]=t.values[0]-e.values[0],i.values[1]=t.values[1]-e.values[1],i}static scale(t,e,i=null){return null===i&&(i=new o),i.values[0]=t.values[0]*e,i.values[1]=t.values[1]*e,i}static scaleAdd(t,e,i,s=null){return null===s&&(s=new o),s.values[0]=t.values[0]+e.values[0]*i,s.values[1]=t.values[0]+e.values[1]*i,s}static dotProduct(t,e){return t.values[0]*e.values[0]+t.values[1]*e.values[1]}static crossProduct(t,e){return t.values[0]*e.values[1]-t.values[1]*e.values[0]}static getAngle(t,e,i=!1){let s=o.dotProduct(t,e),r=Math.acos(s/(t.length*e.length));return!1===i&&(r=h.toDegree(r)),r}static getOrientation(t,e,i=!1){let s=o.difference(e,t),r=Math.atan2(s.y,s.x);return!1===i&&(r=h.toDegree(r)),r}static sinAngle(t,e,i=!1){return!0===i&&(t.normalize(),e.normalize()),t.x*e.y-e.x*t.y}static cosAngle(t,e,i=!1){return!0===i&&(t.normalize(),e.normalize()),o.dotProduct(t,e)}get x(){return this.values[0]}set x(t){this.values[0]=t}get y(){return this.values[1]}set y(t){this.values[1]=t}toString(){return"("+this.values[0]+","+this.values[1]+")"}reset(t=0,e=0){return this.values[0]=t,this.values[1]=e,this}equals(t){return!(Math.abs(this.values[0]-t.values[0])>Number.EPSILON||Math.abs(this.values[1]-t.values[1])>Number.EPSILON)}get squaredLength(){let t=this.values[0],e=this.values[1];return t*t+e*e}get length(){return Math.sqrt(this.squaredLength)}normalize(){let t=this.length;return h.isEquals(t,0)?(this.values[0]=0,this.values[1]=0,0):h.isEquals(t,1)?1:(this.values[0]/=t,this.values[1],t)}add(t){return o.sum(this,t,this)}substract(t){return o.difference(this,t,this)}negative(){return this.values[0]=-this.values[0],this.values[1]=-this.values[1],this}innerProdcut(t){return o.dotProduct(this,t)}}o.xAxis=new o(1,0),o.nXAxis=new o(-1,0),o.yAxis=new o(0,1),o.nYAxis=new o(0,-1);class l extends r{constructor(t,e,i=!1,s=!1,r=!1){super(i,s,r),this.canvasPosition=t,this.button=e,this.localPosition=o.create(),this.hasLocalPosition=!1}}class d{constructor(t){this.id=-1,this.enabled=!1,this.callbackData=void 0,this.countdown=0,this.timeout=0,this.onlyOnce=!1,this.callback=t}}!function(t){t[t.PREORDER=0]="PREORDER",t[t.POSTORDER=1]="POSTORDER"}(e||(e={}));class u{constructor(){this._sprites=[],this._dragSprite=void 0,this.name="Sprite2DManager"}get container(){return this}getParentSprite(){}addSprite(t){return t.owner=this,this._sprites.push(t),this}removeSpriteAt(t){this._sprites.splice(t,1)}removeSprite(t){let e=this.getSpriteIndex(t);return-1!==e&&(this.removeSpriteAt(e),!0)}removeAll(){this._sprites=[]}getSprite(t){if(t<0||t>this._sprites.length-1)throw new Error("参数idx越界");return this._sprites[t]}getSpriteCount(){return this._sprites.length}getSpriteIndex(t){for(let e=0;e<this._sprites.length;e++)if(this._sprites[e]===t)return e;return-1}dispatchUpdate(t,i){for(let s=0;s<this._sprites.length;s++)this._sprites[s].update(t,i,e.PREORDER);for(let s=0;s<this._sprites.length;s++)this._sprites[s].update(t,i,e.POSTORDER)}dispatchDraw(t){for(let e=0;e<this._sprites.length;e++)this._sprites[e].draw(t)}dispatchKeyEvent(t){let e;for(let i=0;i<this._sprites.length;i++)e=this._sprites[i],e.keyEvent&&e.keyEvent(e,t)}dispatchMouseEvent(e){if(e.type===t.MOUSEUP)this._dragSprite=void 0;else if(e.type===t.MOUSEDRAG&&void 0!==this._dragSprite&&null!==this._dragSprite.mouseEvent)return void this._dragSprite.mouseEvent(this._dragSprite,e);let i;for(let s=this._sprites.length-1;s>=0;s--){i=this._sprites[s];let r=i.getLocalMatrix();if(h.transform(r,e.canvasPosition,e.localPosition),i.hitTest(e.localPosition)&&(e.hasLocalPosition=!0,e.type===t.MOUSEDOWN&&(this._dragSprite=i),i.mouseEvent))return void i.mouseEvent(i,e)}}}function c(t,e){return e}function p(t,e){return t-e-1}!function(t){t[t.CUSTOM=0]="CUSTOM",t[t.STROKE=1]="STROKE",t[t.FILL=2]="FILL",t[t.STROKE_FILL=3]="STROKE_FILL",t[t.CLIP=4]="CLIP"}(i||(i={}));class v{constructor(t){this._iter=t,this.reset()}get current(){if(!(this._arrIdx>=this._arr.length))return this._arr[this._arrIdx]}reset(){for(this._arr=[];this._iter.moveNext();)this._arr.push(this._iter.current);this._arrIdx=this._arr.length}moveNext(){return this._arrIdx--,this._arrIdx>=0&&this._arrIdx<this._arr.length}}class g{constructor(t,e,i){void 0!==t&&(this._node=t,this._indexer=e,this._adpter=new i,this._adpter.add(this._node),this._currNode=void 0)}get current(){return this._currNode}reset(){void 0!==this._node&&(this._currNode=void 0,this._adpter.clear(),this._adpter.add(this._node))}moveNext(){if(this._adpter.isEmpty)return!1;if(this._currNode=this._adpter.remove(),void 0!==this._currNode){let t=this._currNode.childCount;for(let e=0;e<t;e++){let i=this._indexer(t,e),s=this._currNode.getChildAt(i);void 0!==s&&this._adpter.add(s)}}return!0}}class _{constructor(){this._arr=[]}add(t){this._arr.push(t)}get length(){return this._arr.length}get isEmpty(){return this._arr.length<=0}clear(){this._arr=[]}toString(){return this._arr.toString()}}class w extends _{remove(){if(this._arr.length>0)return this._arr.shift()}}class m extends _{remove(){if(this._arr.length>0)return this._arr.pop()}}class y{static create_df_l2r_t2b_iter(t){return new g(t,c,m)}static create_df_r2l_t2b_iter(t){return new g(t,p,m)}static create_bf_l2r_t2b_iter(t){return new g(t,c,w)}static create_bf_r2l_t2b_iter(t){return new g(t,p,w)}static create_df_l2r_b2t_iter(t){return new v(y.create_df_r2l_t2b_iter(t))}static create_df_r2l_b2t_iter(t){return new v(y.create_df_l2r_t2b_iter(t))}static create_bf_l2r_b2t_iter(t){return new v(y.create_bf_r2l_t2b_iter(t))}static create_bf_r2l_b2t_iter(t){return new v(y.create_bf_l2r_t2b_iter(t))}}class f extends class{constructor(t,e,i=""){this._parent=e,this._children=void 0,this.data=t,this.name=i,void 0!==this._parent&&this._parent.addChild(this)}get parent(){return this._parent}get childCount(){return void 0===this._children?0:this._children.length}get root(){let t=this;for(;void 0!==t&&void 0!==t.parent;)t=t.parent;return t}get depth(){let t=this,e=0;for(;void 0!==t&&void 0!==t.parent;)t=t.parent,e++;return e}get firstChild(){if(void 0!==this._children&&0!==this._children.length)return this._children[0]}get LastChild(){if(void 0!==this._children&&0!==this._children.length)return this._children[this._children.length-1]}get nextSibling(){if(void 0===this._parent||void 0===this._parent._children||this._parent._children.length<=1)return;let t=-1;for(let e=0;e<this._parent._children.length;e++)if(this===this._parent._children[e]){t=e;break}return-1!==t&&t!==this._parent._children.length-1?this._parent._children[t+1]:void 0}get prevSibling(){if(void 0===this._parent||void 0===this._parent._children||this._parent._children.length<=1)return;let t=-1;for(let e=0;e<this._parent._children.length;e++)if(this===this._parent._children[e]){t=e;break}return-1!==t&&0!==t?this._parent._children[t-1]:void 0}get mostLeft(){let t=this;for(;;){let e=void 0;if(void 0!==t&&(e=t.firstChild),void 0===e)break;t=e}return t}get mostRight(){let t=this;for(;;){let e=void 0;if(void 0!==t&&(e=t.LastChild),void 0===e)break;t=e}return t}hasChild(){return void 0!==this._children&&this._children.length>0}getChildAt(t){if(!(void 0===this._children||t<0||t>=this._children.length))return this._children[t]}isDescendantOf(t){if(void 0!==t)return!1;this._parent;for(let e=this._parent;void 0!==e;e=e._parent)if(e===t)return!0;return!1}removeChildAt(t){if(void 0===this._children)return;let e=this.getChildAt(t);return void 0!==e?(this._children.splice(t,1),e._parent=void 0,e):void 0}removeChild(t){if(void 0===t||void 0===this._children)return;let e=-1;for(let i=0;i<this._children.length;i++)if(this.getChildAt(i)===t){e=i;break}return-1!==e?this.removeChildAt(e):void 0}remove(){if(void 0!==this._parent)return this._parent.removeChild(this)}addChildAt(t,e){if(!this.isDescendantOf(t))return void 0===this._children&&(this._children=[]),e>=0&&e<=this._children.length?(void 0!==t._parent&&t._parent.removeChild(t),t._parent=this,this._children.splice(e,0,t),t):void 0}addChild(t){return void 0===this._children&&(this._children=[]),this.addChildAt(t,this._children.length)}repeatString(t,e){let i="";for(let s=0;s<e;s++)i+=t;return i}visit(t=null,e=null,i=c){null!==t&&t(this);let s=this._children;if(void 0!==s)for(let r=0;r<s.length;r++){let a=this.getChildAt(i(s.length,r));void 0!==a&&a.visit(t,e,i)}null!==e&&e(this)}}{get sprite(){return this.data}constructor(t,e,i="SpriteNode"){super(t,e,i)}addSprite(t){return new f(t,this,t.name)}removeSprite(t){let e=this.getSpriteIndex(t);return-1!==e&&void 0!==this.removeChildAt(e)}removeAll(t){let e;e=y.create_bf_r2l_b2t_iter(this);let i=void 0;for(;e.moveNext();)i=e.current,void 0!==i&&void 0!==i.data&&(i===this?!0===t&&(i.data=void 0,i=i.remove()):(i.data=void 0,i=i.remove()))}getSprite(t){if(t<0||t>this.childCount-1)throw new Error("参数idx越界");let e=this.getChildAt(t).sprite;if(void 0===e)throw alert("sprite为undefined"),new Error("sprite为undefined");return e}getParentSprite(){let t=this.parent;if(void 0!==t)return t.sprite}getSpriteCount(){return this.childCount}addChildAt(t,e){let i=super.addChildAt(t,e);return void 0!==i&&i.data&&(i.data.owner=i),i}getSpriteIndex(t){for(let e=0;e<this.childCount;e++){let i=this.getChildAt(e);if(void 0!==i&&void 0!==i.sprite&&i.sprite===t)return e}return-1}findSprite(t,e=null){let i,s=y.create_bf_r2l_b2t_iter(this.root),r=void 0,a=o.create();for(;s.moveNext();)if(r=s.current,void 0!==r&&void 0!==r.data&&(i=r.data.getLocalMatrix(),h.transform(i,t,a),r.data.hitTest(a)))return null!==e&&(e.x=a.x,e.y=a.y),r.data}update(t,i){void 0!==this.sprite&&(this.sprite.update(t,i,e.PREORDER),this._updateChildren(t,i),this.sprite.update(t,i,e.POSTORDER))}_updateChildren(t,e){for(let i=0;i<this.childCount;i++){let s=this.getChildAt(i);void 0!==s&&s.update(t,e)}}draw(t){void 0!==this.sprite&&(this.sprite.draw(t),this._drawChildren(t))}_drawChildren(t){for(let e=0;e<this.childCount;e++){let i=this.getChildAt(e);void 0!==i&&i.draw(t)}}}class E{constructor(t=0,e=0,i=0,s=1,r=1){this.position=new o(t,e),this.rotation=i,this.scale=new o(s,r)}toMatrix(){return h.matStack.loadIdentity(),h.matStack.translate(this.position.x,this.position.y),h.matStack.rotate(this.rotation,!1),h.matStack.scale(this.scale.x,this.scale.y),h.matStack.matrix}toInvMatrix(t){let e=this.toMatrix();return n.invert(e,t)}}class M{constructor(t,e){this.showCoordSystem=!1,this.renderType=i.FILL,this.isVisible=!0,this.fillStyle="white",this.strokeStyle="black",this.lineWidth=1,this.transform=new E,this.mouseEvent=null,this.keyEvent=null,this.updateEvent=null,this.renderEvent=null,this.name=e,this.shape=t}set x(t){this.transform.position.x=t}get x(){return this.transform.position.x}set y(t){this.transform.position.y=t}get y(){return this.transform.position.y}set rotation(t){this.transform.rotation=t}get rotation(){return this.transform.rotation}set scaleX(t){this.transform.scale.x=t}get scaleX(){return this.transform.scale.x}set scaleY(t){this.transform.scale.y=t}get scaleY(){return this.transform.scale.y}getWorldMatrix(){if(this.owner instanceof f){let t=[],e=this.owner;for(;void 0!==e;)t.push(e),e=e.parent;let i,s=n.create();for(let r=t.length-1;r>=0;r--)e=t[r],e.data&&(i=e.data.transform.toMatrix(),n.multiply(s,i,s));return s}return this.transform.toMatrix()}getLocalMatrix(){let t=this.getWorldMatrix(),e=n.create();if(n.invert(t,e))return e;throw alert("矩阵求逆失败"),new Error("矩阵求逆失败")}update(t,e,i){this.updateEvent&&this.updateEvent(this,t,e,i)}hitTest(t){return!!this.isVisible&&this.shape.hitTest(t,this)}draw(t){this.isVisible&&(this.shape.beginDraw(this,this,t),null!==this.renderEvent&&this.renderEvent(this,t,e.PREORDER),this.shape.draw(this,this,t),null!==this.renderEvent&&this.renderEvent(this,t,e.POSTORDER),this.shape.endDraw(this,this,t))}}class x{constructor(t=10,e=0){if(e<0||e>1)throw alert("t必须设置为[0,1]"),new Error("t必须设置为[0,1]");this.start=o.create(-t*e,0),this.end=o.create(t*(1-e),0),this.data=void 0}hitTest(t,e){return h.isPointOnLineSegement(t,this.start,this.end)}beginDraw(t,e,i){i.save(),i.lineWidth=e.lineWidth,i.strokeStyle=e.strokeStyle;let s=t.getWorldMatrix();i.setTransform(s.values[0],s.values[1],s.values[2],s.values[3],s.values[4],s.values[5])}draw(t,e,i){i.beginPath(),i.moveTo(this.start.x,this.start.y),i.lineTo(this.end.x,this.end.y),i.stroke()}endDraw(t,e,i){i.restore()}get type(){return"Line"}}class S{constructor(){this.axisXStyle="rgba(255,0,0,128)",this.axisYStyle="rgba(0,255,0,128)",this.axisLineLength=1,this.axisLength=100,this.data=void 0}drawLine(t,e,i=!0){t.save(),t.strokeStyle=e,t.lineWidth=this.axisLineLength,t.beginPath(),t.moveTo(0,0),i?t.lineTo(this.axisLength,0):t.lineTo(0,this.axisLength),t.stroke(),t.restore()}beginDraw(t,e,i){i.save(),i.lineWidth=e.lineWidth,i.strokeStyle=e.strokeStyle,i.fillStyle=e.fillStyle;let s=t.getWorldMatrix();i.setTransform(s.values[0],s.values[1],s.values[2],s.values[3],s.values[4],s.values[5])}draw(t,e,s){e.renderType===i.STROKE?s.stroke():e.renderType===i.FILL?s.fill():e.renderType===i.STROKE_FILL?(s.stroke(),s.fill()):e.renderType===i.CLIP&&s.clip()}endDraw(t,e,s){e.renderType!==i.CLIP&&(e.showCoordSystem&&(this.drawLine(s,this.axisXStyle,!0),this.drawLine(s,this.axisYStyle,!1)),s.restore())}}class P extends S{constructor(t=1,e=1,i=0,s=0){super(),this.width=t,this.height=e,this.x=-this.width*i,this.y=-this.height*s}get type(){return"Rect"}hitTest(t,e){return h.isPointInRect(t.x,t.y,this.x,this.y,this.width,this.height)}draw(t,e,i){i.beginPath(),i.moveTo(this.x,this.y),i.lineTo(this.x+this.width,this.y),i.lineTo(this.x+this.width,this.y+this.height),i.lineTo(this.x,this.y+this.height),i.closePath(),super.draw(t,e,i)}}class b extends P{constructor(t=10,e,i,s){super(t,e,0,0),this.xStep=i,this.yStep=s}draw(t,e,s){e.renderType=i.CUSTOM,s.fillRect(0,0,this.width,this.height),s.beginPath();for(let t=this.xStep+.5;t<this.width;t+=this.xStep)s.moveTo(t,0),s.lineTo(t,this.height);for(let t=this.yStep+.5;t<this.height;t+=this.yStep)s.moveTo(0,t),s.lineTo(this.width,t);s.stroke()}get type(){return"Grid"}}class T extends S{constructor(t){super(),this.radius=t}hitTest(t,e){return h.isPointInCircle(t,o.create(0,0),this.radius)}draw(t,e,i){i.beginPath(),i.arc(0,0,this.radius,0,2*Math.PI,!0),super.draw(t,e,i)}get type(){return"Circle"}}class C extends S{constructor(t=10,e=10){super(),this.radiusX=t,this.radiusY=e}hitTest(t,e){return h.isPointInEllipse(t.x,t.y,0,0,this.radiusX,this.radiusY)}draw(t,e,i){i.beginPath(),i.ellipse(0,0,this.radiusX,this.radiusY,0,0,2*Math.PI,!0),super.draw(t,e,i)}get type(){return"Ellipse"}}class R extends S{constructor(t){if(t.length<3)throw alert("多边形顶点数必须大于等于3"),new Error("多边形顶点数必须大于等于3");if(!1===h.isConvex(t))throw alert("当前多边形不是凸多边形"),new Error("当前多边形不是凸多边形");super(),this.points=t}hitTest(t,e){return h.isPointInPolygon(t,this.points)}draw(t,e,i){i.beginPath(),i.moveTo(this.points[0].x,this.points[0].y);for(let t=1;t<this.points.length;t++)i.lineTo(this.points[t].x,this.points[t].y);i.closePath(),super.draw(t,e,i)}get type(){return"Polygon"}}class O{constructor(t=1,e=1){this.values=new Float32Array([t,e])}static create(t=1,e=1){return new O(t,e)}get width(){return this.values[0]}set width(t){this.values[0]=t}get height(){return this.values[1]}set height(t){this.values[1]=t}}class z{constructor(t=new o,e=new O(1,1)){this.origin=t,this.size=e}static create(t=0,e=0,i=1,s=1){let r=new o(t,e),a=new O(i,s);return new z(r,a)}}!function(t){t[t.NONE=0]="NONE",t[t.STRETCH=1]="STRETCH",t[t.REPEAT=2]="REPEAT",t[t.REPEAT_X=3]="REPEAT_X",t[t.REPEAT_Y=4]="REPEAT_Y"}(s||(s={}));class k extends P{constructor(t,e,i,s,r){super(e,i,s,r),this.data=t,this._calcDestRects()}get type(){return"Scale9Grid"}_calcDestRects(){let t;this.srcRects=[],this.destRects=[],t=new z,t.origin.reset(0,0),t.size.width=this.data.leftMargin,t.size.height=this.data.topMargin,this.srcRects.push(t),t=new z,t.origin.reset(this.x,this.y),t.size.width=this.data.leftMargin,t.size.height=this.data.topMargin,this.destRects.push(t),t=new z,t.origin.reset(this.data.leftMargin,0),t.size.width=this.data.image.width-this.data.leftMargin-this.data.rightMargin,t.size.height=this.data.topMargin,this.srcRects.push(t),t=new z,t.origin.reset(this.x+this.data.leftMargin,this.y),t.size.width=this.width-this.data.leftMargin-this.data.rightMargin,t.size.height=this.data.topMargin,this.destRects.push(t),t=new z,t.origin.reset(this.data.image.width-this.data.rightMargin,0),t.size.width=this.data.rightMargin,t.size.height=this.data.topMargin,this.srcRects.push(t),t=new z,t.origin.reset(this.x+this.width-this.data.rightMargin,this.y),t.size.width=this.data.rightMargin,t.size.height=this.data.topMargin,this.destRects.push(t),t=new z,t.origin.reset(0,this.data.topMargin),t.size.width=this.data.leftMargin,t.size.height=this.data.image.height-this.data.topMargin-this.data.bottomMargin,this.srcRects.push(t),t=new z,t.origin.reset(this.x,this.y+this.data.topMargin),t.size.width=this.data.leftMargin,t.size.height=this.height-this.data.topMargin-this.data.bottomMargin,this.destRects.push(t),t=new z,t.origin.reset(this.data.leftMargin,this.data.topMargin),t.size.width=this.data.image.width-this.data.leftMargin-this.data.rightMargin,t.size.height=this.data.image.height-this.data.topMargin-this.data.bottomMargin,this.srcRects.push(t),t=new z,t.origin.reset(this.x+this.data.leftMargin,this.y+this.data.topMargin),t.size.width=this.width-this.data.leftMargin-this.data.rightMargin,t.size.height=this.height-this.data.topMargin-this.data.bottomMargin,this.destRects.push(t),t=new z,t.origin.reset(this.data.image.width-this.data.rightMargin,this.data.topMargin),t.size.width=this.data.rightMargin,t.size.height=this.data.image.height-this.data.topMargin-this.data.bottomMargin,this.srcRects.push(t),t=new z,t.origin.reset(this.x+this.width-this.data.rightMargin,this.y+this.data.topMargin),t.size.width=this.data.rightMargin,t.size.height=this.height-this.data.topMargin-this.data.bottomMargin,this.destRects.push(t),t=new z,t.origin.reset(0,this.data.image.height-this.data.bottomMargin),t.size.width=this.data.leftMargin,t.size.height=this.data.bottomMargin,this.srcRects.push(t),t=new z,t.origin.reset(this.x,this.y+this.height-this.data.bottomMargin),t.size.width=this.data.leftMargin,t.size.height=this.data.bottomMargin,this.destRects.push(t),t=new z,t.origin.reset(this.data.leftMargin,this.data.image.height-this.data.bottomMargin),t.size.width=this.data.image.width-this.data.leftMargin-this.data.rightMargin,t.size.height=this.data.bottomMargin,this.srcRects.push(t),t=new z,t.origin.reset(this.x+this.data.leftMargin,this.y+this.height-this.data.bottomMargin),t.size.width=this.width-this.data.leftMargin-this.data.rightMargin,t.size.height=this.data.bottomMargin,this.destRects.push(t),t=new z,t.origin.reset(this.data.image.width-this.data.rightMargin,this.data.image.height-this.data.bottomMargin),t.size.width=this.data.rightMargin,t.size.height=this.data.bottomMargin,this.srcRects.push(t),t=new z,t.origin.reset(this.x+this.width-this.data.rightMargin,this.y+this.height-this.data.bottomMargin),t.size.width=this.data.rightMargin,t.size.height=this.data.bottomMargin,this.destRects.push(t)}_drawImage(t,e,i,r,a=s.STRETCH){if(null===i||null===r)return!1;if(a===s.STRETCH)t.drawImage(e,r.origin.x,r.origin.y,r.size.width,r.size.height,i.origin.x,i.origin.y,i.size.width,i.size.height);else{let n=Math.ceil(i.size.width/r.size.width),h=Math.ceil(i.size.height/r.size.height),o=0,l=0,d=0,u=0,c=0,p=0,v=i.origin.x+i.size.width,g=i.origin.y+i.size.height;a===s.REPEAT_X?h=1:a===s.REPEAT_Y&&(n=1);for(let s=0;s<n;s++)for(let a=0;a<h;a++)o=i.origin.x+s*r.size.width,l=i.origin.y+a*r.size.height,c=r.size.width,p=r.size.height,d=o+c,u=d+p,d>v&&(c=r.size.width-(d-v)),u>g&&(p=r.size.height-(u-g)),t.drawImage(e,r.origin.x,r.origin.y,c,p,o,l,c,p)}return!0}draw(t,e,i){for(let t=0;t<this.srcRects.length;t++)this._drawImage(i,this.data.image,this.destRects[t],this.srcRects[t],s.STRETCH)}}class D extends x{get type(){return"Bone"}endDraw(t,e,i){super.endDraw(t,e,i),i.save();let s=t.getWorldMatrix();i.setTransform(1,0,0,1,s.values[4],s.values[5]),i.beginPath(),i.fillStyle="blue",i.arc(this.start.x,this.start.y,5,0,Math.PI,!0),i.fill(),i.restore()}}class I extends S{constructor(t,e=!1){super(),this.points=t,this.isCubic=e,this.data=t}get type(){return"BezierPath"}hitTest(t,e){return!1}draw(t,e,i){if(i.beginPath(),i.moveTo(this.points[0].x,this.points[0].y),this.isCubic)for(let t=1;t<this.points.length;t+=3)i.bezierCurveTo(this.points[t].x,this.points[t].y,this.points[t+1].x,this.points[t+1].y,this.points[t+2].x,this.points[t+2].y);else for(let t=1;t<this.points.length;t+=2)i.quadraticCurveTo(this.points[t].x,this.points[t].y,this.points[t+1].x,this.points[t+1].y);super.draw(t,e,i)}}class L{static createSprite(t,e=""){return new M(t,e)}static createLine(t,e){let i=new x;return i.start=t,i.end=e,i}static createXLine(t=10,e=0){return new x(t,e)}static createGrid(t,e,i=10,s=10){return new b(t,e,i,s)}static createCircle(t){return new T(t)}static createRect(t,e,i=0,s=0){return new P(t,e,i,s)}static createEllipse(t,e){return new C(t,e)}static createPolygon(t){if(t.length<3)throw new Error("多边形顶点数量必须大于等于3");return new R(t)}static createScale9Grid(t,e,i,s=0,r=0){return new k(t,e,i,s,r)}static createBone(t,e){return new D(t,e)}static createBezierPath(t,e=!1){return new I(t,e)}static createClipSprite(t=""){let e=new M(L.endClipShape,t);return e.renderType=i.CLIP,e}}L.endClipShape=new class{get type(){return"EndClipShape"}hitTest(t,e){return!1}beginDraw(t,e,i){}draw(t,e,i){}endDraw(t,e,i){i.restore()}};class A{constructor(t,e){this._dragSprite=void 0;let s=L.createSprite(L.createGrid(t,e));s.name="root",s.strokeStyle="black",s.fillStyle="white",s.renderType=i.STROKE_FILL,this._rootNode=new f(s,void 0,s.name),s.owner=this._rootNode}get container(){return this._rootNode}dispatchMouseEvent(e){if(e.type===t.MOUSEUP)this._dragSprite=void 0;else if(e.type===t.MOUSEDRAG&&void 0!==this._dragSprite&&null!==this._dragSprite.mouseEvent)return void this._dragSprite.mouseEvent(this._dragSprite,e);let i=this._rootNode.findSprite(e.canvasPosition,e.localPosition);if(void 0!==i){if(e.hasLocalPosition=!0,0===e.button&&e.type===t.MOUSEDOWN&&(this._dragSprite=i),e.type===t.MOUSEDRAG)return;if(i.mouseEvent)return void i.mouseEvent(i,e)}else e.hasLocalPosition=!1}dispatchKeyEvent(t){this._rootNode.visit((e=>{void 0!==e.data&&null!==e.data.keyEvent&&e.data.keyEvent(e.data,t)}))}dispatchUpdate(t,e){this._rootNode.update(t,e)}dispatchDraw(t){this._rootNode.draw(t)}}let K=document.getElementById("canvas");function U(){K.width=window.innerWidth,K.height=window.innerHeight}U(),window.addEventListener("resize",U);let N=document.getElementById("number"),B=new class extends class extends class{constructor(t){this._timeId=-1,this._fps=0,this._start=!1,this._requestId=-1,this.timers=[],this.canvas=t,this.canvas.addEventListener("mousedown",this,!1),this.canvas.addEventListener("mouseup",this,!1),this.canvas.addEventListener("mousemove",this,!1),this.canvas.oncontextmenu=()=>!1,window.addEventListener("keydown",this,!1),window.addEventListener("keyup",this,!1),window.addEventListener("keypress",this,!1),this._isMouseDonw=!1,this.isSupportMouseMove=!1}get fps(){return this._fps}_viewportToCanvasCoordinate(t){if(this.canvas){let e=this.canvas.getBoundingClientRect();if(t.target){let i=0,s=0,r=0,a=0,n=window.getComputedStyle(t.target),h=n.borderLeftWidth;null!==h&&(i=parseInt(h,10)),h=n.borderTopWidth,null!==h&&(s=parseInt(h,10)),h=n.paddingLeft,null!==h&&(r=parseInt(h,10)),h=n.paddingTop,null!==h&&(a=parseInt(h,10));let l=t.clientX-e.left-i-r,d=t.clientY-e.top-s-a;return o.create(l,d)}}throw alert("canvas未设置"),new Error("canvas未设置")}_toCanvasMouseEvent(t){let e=t,i=this._viewportToCanvasCoordinate(e);return new l(i,e.button,e.altKey,e.ctrlKey,e.shiftKey)}_toCanvasKeyBoardEvent(t){let e=t;return new a(e.key,e.keyCode,e.repeat,e.altKey,e.ctrlKey,e.shiftKey)}_handleTimers(t){for(let e=0;e<this.timers.length;e++){let i=this.timers[e];!1!==i.enabled&&(i.countdown-=t,i.countdown<0&&(i.callback(i.id,i.callbackData),!1===i.onlyOnce?i.countdown=i.timeout:this.removeTimer(i.id)))}}dispatchMouseDown(e){e.type=t.MOUSEDOWN}dispatchMouseUp(e){e.type=t.MOUSEUP}dispatchMouseMove(e){e.type=t.MOUSEMOVE}dispatchMouseDrag(e){e.type=t.MOUSEDRAG}dispatchKeyPress(e){e.type=t.KEYPRESS}dispatchKeyDown(e){e.type=t.KEYDOWN}dispatchKeyUp(e){e.type=t.KEYUP}addTimer(t,e=1,i=!1,s){let r;for(let a=0;a<this.timers.length;a++)if(r=this.timers[a],!1===r.enabled)return r.callback=t,r.callbackData=s,r.timeout=e,r.countdown=e,r.enabled=!0,r.onlyOnce=i,r.id;return r=new d(t),r.callbackData=s,r.timeout=e,r.countdown=e,r.enabled=!0,r.id=++this._timeId,r.onlyOnce=i,this.timers.push(r),r.id}removeTimer(t){let e=!1;for(let i=0;i<this.timers.length;i++)if(this.timers[i].id===t){this.timers[i].enabled=!1,e=!0;break}return e}handleEvent(t){switch(t.type){case"mousedown":this._isMouseDonw=!0,this.dispatchMouseDown(this._toCanvasMouseEvent(t));break;case"mouseup":this._isMouseDonw=!1,this.dispatchMouseUp(this._toCanvasMouseEvent(t));break;case"mousemove":this.isSupportMouseMove&&this.dispatchMouseMove(this._toCanvasMouseEvent(t)),this._isMouseDonw&&this.dispatchMouseDrag(this._toCanvasMouseEvent(t));break;case"keypress":this.dispatchKeyPress(this._toCanvasKeyBoardEvent(t));break;case"keydown":this.dispatchKeyDown(this._toCanvasKeyBoardEvent(t));break;case"keyup":this.dispatchKeyUp(this._toCanvasKeyBoardEvent(t))}}start(){this._start||(this._start=!0,this._requestId=-1,this._startTime=-1,this._lastTime=-1,this._requestId=requestAnimationFrame((t=>{this.step(t)})))}stop(){this._start&&(cancelAnimationFrame(this._requestId),this._requestId=-1,this._lastTime=-1,this._startTime=-1,this._start=!1)}isRunning(){return this._start}step(t){-1===this._startTime&&(this._startTime=t),-1===this._lastTime&&(this._lastTime=t);let e=t-this._startTime,i=t-this._lastTime;0!==i&&(this._fps=1e3/i),i/=1e3,this._lastTime=t,this._handleTimers(i),this.update(e,i),this.render(),this._requestId=requestAnimationFrame((t=>{this.step(t)}))}update(t,e){}render(){}}{constructor(t,e){super(t),this.context2D=this.canvas.getContext("2d",e)}}{constructor(t,e=!0){super(t),this._dispatcher=e?new A(t.width,t.height):new u}get rootContainer(){return this._dispatcher.container}dispatchMouseDown(t){super.dispatchMouseDown(t),this._dispatcher.dispatchMouseEvent(t)}dispatchMouseUp(t){super.dispatchMouseUp(t),this._dispatcher.dispatchMouseEvent(t)}dispatchMouseMove(t){super.dispatchMouseMove(t),this._dispatcher.dispatchMouseEvent(t)}dispatchMouseDrag(t){super.dispatchMouseDrag(t),this._dispatcher.dispatchMouseEvent(t)}dispatchKeyDown(t){super.dispatchKeyDown(t),this._dispatcher.dispatchKeyEvent(t)}dispatchKeyUp(t){super.dispatchKeyUp(t),this._dispatcher.dispatchKeyEvent(t)}dispatchKeyPress(t){super.dispatchKeyPress(t),this._dispatcher.dispatchKeyEvent(t)}update(t,e){this._dispatcher.dispatchUpdate(t,e)}render(){this.context2D&&(this.context2D.clearRect(0,0,this.canvas.width,this.canvas.height),this._dispatcher.dispatchDraw(this.context2D))}}(K);B.addTimer((()=>{N.innerText=B.fps.toFixed(1)}),0,!1),new class{constructor(t){this._app=t,this._addPointEnd=!1,this._curveIndex=0,this._curveParamT=0,this._position=o.create(),this._lastPosition=o.create(),this._speed=5,this._curvePts=[],this._circle=L.createCircle(5),this._rect=L.createRect(10,10,.5,.5),void 0!==this._app.rootContainer.sprite&&(this._app.rootContainer.sprite.mouseEvent=this._mouseEvent.bind(this),this._app.rootContainer.sprite.keyEvent=this._keyEvent.bind(this)),this._app.start()}_createBezierMarker(e,i,s){let r,a=this._curvePts.length;this._curvePts.push(o.create(e,i)),s?(r=L.createSprite(this._circle),r.fillStyle="blue"):(r=L.createSprite(this._rect),r.fillStyle="red"),r.x=e,r.y=i,r.name="curvePt"+this._curvePts.length,this._app.rootContainer.addSprite(r),r.mouseEvent=(e,i)=>{i.type===t.MOUSEDRAG&&(e.x=i.canvasPosition.x,e.y=i.canvasPosition.y,this._curvePts[a].x=e.x,this._curvePts[a].y=e.y)}}_createLine(t,e,i){let s=L.createSprite(L.createLine(t,e));s.lineWidth=2,s.strokeStyle="green",s.name="line"+i,this._app.rootContainer.addSprite(s)}_createBezierPath(){this._bezierPath=L.createBezierPath(this._curvePts);let t=L.createSprite(this._bezierPath);t.strokeStyle="blue",t.renderType=i.STROKE,t.name="bezierPath",this._app.rootContainer.addSprite(t);for(let t=1;t<this._curvePts.length;t++)this._createLine(this._curvePts[t-1],this._curvePts[t],t)}_createTank(t,e,s,r,a){let n=L.createRect(s,r,.5,.5),h=L.createSprite(n);h.x=t,h.y=e,h.fillStyle="grey",h.name="tank",this._app.rootContainer.addSprite(h),h.renderType=i.CLIP,n=L.createEllipse(15,10);let l=L.createSprite(n);l.fillStyle="red",l.name="turret",l.keyEvent=this._keyEvent.bind(this),h.owner.addSprite(l),h.owner.addSprite(L.createClipSprite()),n=L.createLine(o.create(0,0),o.create(a,0));let d=L.createSprite(n);d.strokeStyle="blue",d.lineWidth=3,d.name="gun",l.owner.addSprite(d),d.renderEvent=this._renderEvent.bind(this),h.updateEvent=this._updateEvent.bind(this)}_getCurveCount(){let t=this._curvePts.length;if(t<=3)throw new Error("顶点数量必须大于3");return(t-1)/2}_updateCurveIndex(t){this._curveParamT+=this._speed*t,this._curveParamT>=1&&(this._curveIndex++,this._curveParamT=this._curveParamT%1),this._curveIndex>=this._getCurveCount()&&(this._curveIndex=0)}_updateEvent(t,i,s,r){if(r===e.PREORDER){this._updateCurveIndex(.1*s);let e=this._curvePts[2*this._curveIndex],i=this._curvePts[2*this._curveIndex+1],r=this._curvePts[2*this._curveIndex+2];o.copy(this._position,this._lastPosition),h.getQuadraticBezierVector(e,i,r,this._curveParamT,this._position),t.x=this._position.x,t.y=this._position.y,t.rotation=o.getOrientation(this._lastPosition,this._position,!1)}}_renderEvent(t,i,s){s===e.POSTORDER?(i.save(),i.translate(100,0),i.beginPath(),i.arc(0,0,5,0,2*Math.PI),i.fill(),i.restore()):(i.save(),i.translate(80,0),i.fillRect(-5,-5,10,10),i.restore())}_mouseEvent(e,i){if(i.type===t.MOUSEDOWN){if(e===this._app.rootContainer.sprite&&this._addPointEnd)return;this._curvePts.length%2==0?this._createBezierMarker(i.canvasPosition.x,i.canvasPosition.y,!0):this._createBezierMarker(i.canvasPosition.x,i.canvasPosition.y,!1)}}_keyEvent(e,i){if(i.type===t.KEYUP)if("e"===i.key){if(this._addPointEnd)return;this._curvePts.length>3&&(this._curvePts.length-1)%2>0&&(this._curvePts.push(this._curvePts[0]),this._addPointEnd=!0,this._createBezierPath(),this._position.x=this._curvePts[0].x,this._position.y=this._curvePts[0].y,this._createTank(this._position.x,this._position.y,80,50,80))}else"r"===i.key&&this._addPointEnd&&(this._addPointEnd=!1,this._curvePts=[],this._app.rootContainer.removeAll(!1));else i.type===t.KEYPRESS&&("a"===i.key?this._addPointEnd&&"turret"===e.name&&(e.rotation+=5):"s"===i.key&&this._addPointEnd&&"turret"===e.name&&(e.rotation-=5))}}(B)})();