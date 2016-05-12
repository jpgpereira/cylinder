<a name="module_Cylinder"></a>

## Cylinder
Main framework class.<br />This class extends on <a target="_blank" href="http://backbonejs.org/#Events">Backbone.Events</a>.


* [Cylinder](#module_Cylinder)
    * [.$](#module_Cylinder.$) : <code>jQuery</code>
    * [._](#module_Cylinder._) : <code>Underscore</code>
    * [.s](#module_Cylinder.s) : <code>UnderscoreString</code>
    * [.debug](#module_Cylinder.debug) : <code>Boolean</code>
    * [.initialized()](#module_Cylinder.initialized) ⇒ <code>Boolean</code>
    * [.dependency(...dependencies, [silent])](#module_Cylinder.dependency) ⇒ <code>Boolean</code>
    * [.extend(func, [extendOnInit])](#module_Cylinder.extend) ⇒ <code>Mixed</code>
    * [.module(name, func)](#module_Cylinder.module) ⇒ <code>Mixed</code>
    * [.modules()](#module_Cylinder.modules) ⇒ <code>Array</code>
    * [.init([callback])](#module_Cylinder.init) ⇒ <code>CylinderClass</code>


* * *

<a name="module_Cylinder.$"></a>

### Cylinder.$ : <code>jQuery</code>
The jQuery instance.

**Kind**: static property of <code>[Cylinder](#module_Cylinder)</code>  

* * *

<a name="module_Cylinder._"></a>

### Cylinder._ : <code>Underscore</code>
The underscore.js instance.

**Kind**: static property of <code>[Cylinder](#module_Cylinder)</code>  

* * *

<a name="module_Cylinder.s"></a>

### Cylinder.s : <code>UnderscoreString</code>
The underscore.string instance.

**Kind**: static property of <code>[Cylinder](#module_Cylinder)</code>  

* * *

<a name="module_Cylinder.debug"></a>

### Cylinder.debug : <code>Boolean</code>
Debug mode.

**Kind**: static property of <code>[Cylinder](#module_Cylinder)</code>  

* * *

<a name="module_Cylinder.initialized"></a>

### Cylinder.initialized() ⇒ <code>Boolean</code>
Checks if the framework has been initialized.

**Kind**: static method of <code>[Cylinder](#module_Cylinder)</code>  

* * *

<a name="module_Cylinder.dependency"></a>

### Cylinder.dependency(...dependencies, [silent]) ⇒ <code>Boolean</code>
Validate if a variable or a dependency exists.The framework will check if it exists in the global scope.

**Kind**: static method of <code>[Cylinder](#module_Cylinder)</code>  
**Returns**: <code>Boolean</code> - Returns true if it exists, and throws an exception if it doesn't (unless the last argument is <code>true</code>).  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>...dependencies</td><td><code>String</code> | <code>Object</code></td><td><p>The names of the dependencies to be checked.</p>
</td>
    </tr><tr>
    <td>[silent]</td><td><code>Boolean</code></td><td><p>If true, the method will not throw an exception when a mandatory dependency is not found.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// throws an exception because "asdf" is not declared.// you can also specify objects for a cleaner exception output.Cylinder.dependency(    'async',    'jQuery',    { package: '_', name: 'underscore.js' },    { package: 's', name: 'underscore.string', scope: window, optional: true },    'Backbone',    'asdf');
```
**Example**  
```js
// you can check for dependencies inside a variable// and the whole family tree will be checked from top-levelCylinder.dependency('$.fn.slick', 'Cylinder.router', 'Cylinder.resize');
```
**Example**  
```js
// doesn't throw an exception// and allows the programmer to gracefully handle missing dependenciesif (Cylinder.dependency('$.fn.velocity', true)) {    // velocity is present    $('#element').velocity({ top: 0 });}else {    // velocity.js is not defined    // so the programmer can use a fallback    $('#element').animate({ top: 0 });}
```

* * *

<a name="module_Cylinder.extend"></a>

### Cylinder.extend(func, [extendOnInit]) ⇒ <code>Mixed</code>
Extends the framework's core.<br />If <code>extendOnInit</code> is true, then the framework won't be extended until properly initialized.

**Kind**: static method of <code>[Cylinder](#module_Cylinder)</code>  
**Returns**: <code>Mixed</code> - Returns the result of 'func' after evaluated.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>func</td><td><code>function</code> | <code>Object</code></td><td><p>The extension&#39;s constructor.</p>
</td>
    </tr><tr>
    <td>[extendOnInit]</td><td><code>Boolean</code></td><td><p>If true, the framework will only add &#39;func&#39; after &#39;init&#39; is called.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
Cylinder.extend(function (cl) {    var extension = {};    extension.abc = 123;    extension.dfg = 456;    return extension;});console.log(Cylinder.abc); // 123console.log(Cylinder.dfg); // 456
```

* * *

<a name="module_Cylinder.module"></a>

### Cylinder.module(name, func) ⇒ <code>Mixed</code>
Extends the framework with a specific named module.<br />The module won't be added until the framework is properly initialized.When, or if, <code>initialize()</code> is called, then the module will be added as well.

**Kind**: static method of <code>[Cylinder](#module_Cylinder)</code>  
**Returns**: <code>Mixed</code> - Returns the result of 'func' after evaluated.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>name</td><td><code>String</code></td><td><p>The module&#39;s name.</p>
</td>
    </tr><tr>
    <td>func</td><td><code>function</code></td><td><p>The module&#39;s constructor.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
Cylinder.module('mymodule', function (cl, module) {    module.alert = function (str) {        alert('abc');    };    return module;});Cylinder.mymodule.alert('hello!');
```

* * *

<a name="module_Cylinder.modules"></a>

### Cylinder.modules() ⇒ <code>Array</code>
Returns a list of existing modules.

**Kind**: static method of <code>[Cylinder](#module_Cylinder)</code>  

* * *

<a name="module_Cylinder.init"></a>

### Cylinder.init([callback]) ⇒ <code>CylinderClass</code>
Properly initializes the framework.<br />This method is based on jQuery's <code>$(document).ready()</code> shorthand.

**Kind**: static method of <code>[Cylinder](#module_Cylinder)</code>  
**Returns**: <code>CylinderClass</code> - Returns the instance itself.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[callback]</td><td><code>function</code></td><td><p>Function to run after initialization.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// initialize the current instance// onto a new, more type-friendly, variablevar cl = Cylinder.init(function () {    console.log('cylinder is initialized!');    console.log('modules present:', cl.modules());});
```

* * *

