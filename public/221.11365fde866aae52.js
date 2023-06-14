"use strict";(self.webpackChunkproduct_list_front=self.webpackChunkproduct_list_front||[]).push([[221],{4232:(C,p,o)=>{o.d(p,{M:()=>v});var u=o(3144),r=o(262),_=o(4004),m=o(2843),a=o(1940),g=o(3020);let v=(()=>{class t{constructor(i){this.httpClient=i,this.httpHeaders=(new u.WM).set("Content-Type","application/json")}addProduct(i){return this.httpClient.post(a.V.addProduct,i).pipe((0,r.K)(this.handleError))}getProducts(){return this.httpClient.get(a.V.getProducts)}getProductById(i){return this.httpClient.get(`${a.V.getProducts}/${i}`,{headers:this.httpHeaders}).pipe((0,_.U)(l=>l||{}),(0,r.K)(this.handleError))}updateProduct(i,s){return this.httpClient.put(`${a.V.updateProduct}/${i}`,s).pipe((0,r.K)(this.handleError))}deleteProduct(i){return this.httpClient.delete(`${a.V.deleteProduct}/${i}`,{headers:this.httpHeaders}).pipe((0,r.K)(this.handleError))}handleError(i){let s="";return s=i?.error instanceof ErrorEvent?i.error.message:`Error Code: ${i?.status}\nMessage: ${i?.message}`,(0,m._)(()=>{})}}return t.\u0275fac=function(i){return new(i||t)(g.LFG(u.eN))},t.\u0275prov=g.Yz7({token:t,factory:t.\u0275fac,providedIn:"root"}),t})()},8221:(C,p,o)=>{o.r(p),o.d(p,{AddProductComponent:()=>I});var u=o(4755),r=o(5030),_=o(4232),m=o(7354),a=o(7579),g=o(2722),v=o(1109),t=o(3020),f=o(4876),i=o(2018);function s(n,c){if(1&n&&(t.TgZ(0,"div",12),t._uU(1),t.qZA()),2&n){const e=t.oxw();t.xp6(1),t.hij(" ",e.getErrorMessage("name")," ")}}function l(n,c){if(1&n&&(t.TgZ(0,"div",12),t._uU(1),t.qZA()),2&n){const e=t.oxw();t.xp6(1),t.hij(" ",e.getErrorMessage("price")," ")}}function A(n,c){if(1&n&&(t.TgZ(0,"div",12),t._uU(1),t.qZA()),2&n){const e=t.oxw();t.xp6(1),t.hij(" ",e.getErrorMessage("description")," ")}}function M(n,c){if(1&n&&(t.TgZ(0,"div",12),t._uU(1),t.qZA()),2&n){const e=t.oxw();t.xp6(1),t.hij(" ",e.getErrorMessage("image")," ")}}const h=function(n){return{"is-invalid":n}};let I=(()=>{class n{constructor(e,d,P,E,D){this.formBuilder=e,this.route=d,this.productService=P,this.formValidationService=E,this.toastr=D,this.selectedFile=null,this.destroy$=new a.x,this.productForm=this.formBuilder.group({name:["",[r.kI.required,r.kI.minLength(3)]],price:["",[r.kI.required,r.kI.pattern(/^\d+(\.\d{1,2})?$/)]],description:["",[r.kI.required,r.kI.maxLength(200)]],image:["",[r.kI.required,this.formValidationService.fileExtension()]]})}onFileSelected(e){const d=e.target.files?.[0];d&&(this.selectedFile=d)}onSubmit(){if(this.productForm.invalid)return;const e=new FormData;e.append("name",this.productForm.value.name),e.append("price",this.productForm.value.price),e.append("description",this.productForm.value.description),this.selectedFile&&e.append("image",this.selectedFile),this.productService.addProduct(e).pipe((0,g.R)(this.destroy$)).subscribe(()=>{this.toastr.success(v.k.addedProduct),this.productForm.reset(),this.route.navigate(["products"])})}isInvalid(e){return this.formValidationService.isInvalid(e,this.productForm)}getErrorMessage(e){return this.formValidationService.getErrorMessage(e,this.productForm)}ngOnDestroy(){this.destroy$.next(null),this.destroy$.complete()}}return n.\u0275fac=function(e){return new(e||n)(t.Y36(r.qu),t.Y36(f.F0),t.Y36(_.M),t.Y36(m.m),t.Y36(i._W))},n.\u0275cmp=t.Xpm({type:n,selectors:[["app-add-product"]],standalone:!0,features:[t._Bn([_.M,m.m]),t.jDz],decls:28,vars:18,consts:[[1,"row","justify-content-center","mt-5"],[1,"col-md-8"],[3,"formGroup","ngSubmit"],[1,"form-group"],[1,"pb-1"],["type","text","formControlName","name","required","",1,"form-control",3,"ngClass"],["class","error-message",4,"ngIf"],["type","text","formControlName","price","required","",1,"form-control",3,"ngClass"],["type","text","formControlName","description","required","",1,"form-control",3,"ngClass"],["type","file","formControlName","image","required","",1,"form-control",3,"ngClass","change"],[1,"form-group","d-flex","justify-content-end","pt-3"],["type","submit",1,"btn","btn-primary","btn-block",3,"disabled"],[1,"error-message"]],template:function(e,d){1&e&&(t.TgZ(0,"div",0)(1,"div",1)(2,"h1"),t._uU(3,"Add new product"),t.qZA(),t.TgZ(4,"form",2),t.NdJ("ngSubmit",function(){return d.onSubmit()}),t.TgZ(5,"div",3)(6,"label",4),t._uU(7,"Name"),t.qZA(),t._UZ(8,"input",5),t.YNc(9,s,2,1,"div",6),t.qZA(),t.TgZ(10,"div",3)(11,"label",4),t._uU(12,"Price"),t.qZA(),t._UZ(13,"input",7),t.YNc(14,l,2,1,"div",6),t.qZA(),t.TgZ(15,"div",3)(16,"label",4),t._uU(17,"Description"),t.qZA(),t._UZ(18,"input",8),t.YNc(19,A,2,1,"div",6),t.qZA(),t.TgZ(20,"div",3)(21,"label",4),t._uU(22,"Image"),t.qZA(),t.TgZ(23,"input",9),t.NdJ("change",function(E){return d.onFileSelected(E)}),t.qZA(),t.YNc(24,M,2,1,"div",6),t.qZA(),t.TgZ(25,"div",10)(26,"button",11),t._uU(27,"Add Product"),t.qZA()()()()()),2&e&&(t.xp6(4),t.Q6J("formGroup",d.productForm),t.xp6(4),t.Q6J("ngClass",t.VKq(10,h,d.isInvalid("name"))),t.xp6(1),t.Q6J("ngIf",d.isInvalid("name")),t.xp6(4),t.Q6J("ngClass",t.VKq(12,h,d.isInvalid("price"))),t.xp6(1),t.Q6J("ngIf",d.isInvalid("price")),t.xp6(4),t.Q6J("ngClass",t.VKq(14,h,d.isInvalid("description"))),t.xp6(1),t.Q6J("ngIf",d.isInvalid("description")),t.xp6(4),t.Q6J("ngClass",t.VKq(16,h,d.isInvalid("image"))),t.xp6(1),t.Q6J("ngIf",d.isInvalid("image")),t.xp6(2),t.Q6J("disabled",d.productForm.invalid))},dependencies:[u.ez,u.mk,u.O5,r.UX,r._Y,r.Fj,r.JJ,r.JL,r.Q7,r.sg,r.u],styles:[".error-message[_ngcontent-%COMP%]{font-size:10px;padding-top:5px;color:red}"]}),n})()}}]);