<a name="module_store"></a>

## store
Store module for CylinderClass.


* [store](#module_store)
    * [.Model](#module_store.Model) : <code>Model</code>
    * [.use(name, obj)](#module_store.use) ⇒ <code>Model</code>
    * [.unuse(name)](#module_store.unuse) ⇒ <code>Model</code>
    * [.models()](#module_store.models) ⇒ <code>Array</code>
    * [.with(name, exception)](#module_store.with) ⇒ <code>Model</code>
    * [.switch(name)](#module_store.switch) ⇒ <code>Model</code>


* * *

<a name="module_store.Model"></a>

### store.Model : <code>Model</code>
Default model that can and should be used to create new data models.<br />

**Kind**: static property of <code>[store](#module_store)</code>  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>Model.fetch</td><td><code>function</code></td><td>Loads properties onto the model. The module does not call this method automatically.</td>
    </tr><tr>
    <td>Model.save</td><td><code>function</code></td><td>Saves properties from the model using your method of choice.</td>
    </tr><tr>
    <td>Model.destroy</td><td><code>function</code></td><td>Should be used to completely destroy a model. Use at your discretion.</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// the following example creates a new model that will
```
**Example**  
```js
// the following doesn't take advantage of the Model,
```

* * *

<a name="module_store.use"></a>

### store.use(name, obj) ⇒ <code>Model</code>
Adds a model to the data store.<br />

**Kind**: static method of <code>[store](#module_store)</code>  
**Returns**: <code>Model</code> - Returns the model itself after being added and initialized.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>name</td><td><code>String</code></td><td><p>The name of the model to add.</p>
</td>
    </tr><tr>
    <td>obj</td><td><code>Model</code> | <code>Object</code></td><td><p>The model to add.</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="module_store.unuse"></a>

### store.unuse(name) ⇒ <code>Model</code>
Removes a model from the data store.

**Kind**: static method of <code>[store](#module_store)</code>  
**Returns**: <code>Model</code> - Returns the model itself after being removed.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>name</td><td><code>String</code></td><td><p>The name of the data model to remove.</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="module_store.models"></a>

### store.models() ⇒ <code>Array</code>
Returns a list of existing models.

**Kind**: static method of <code>[store](#module_store)</code>  

* * *

<a name="module_store.with"></a>

### store.with(name, exception) ⇒ <code>Model</code>
Returns a previously registered data model.

**Kind**: static method of <code>[store](#module_store)</code>  
**Returns**: <code>Model</code> - Returns the model itself, or null if it's not found and <code>exception</code> is <code>false</code>.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>name</td><td><code>String</code></td><td><p>The name of the model.</p>
</td>
    </tr><tr>
    <td>exception</td><td><code>Boolean</code></td><td><p>If false, the method won&#39;t throw an exception if the model is not found.</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="module_store.switch"></a>

### store.switch(name) ⇒ <code>Model</code>
Switches store contexts to a previously registered data model.<br /><br />

**Kind**: static method of <code>[store](#module_store)</code>  
**Returns**: <code>Model</code> - Returns the model itself after switching.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>name</td><td><code>String</code></td><td><p>The name of the model.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
Cylinder.store.switch('localstorage'); // switches the "Cylinder.store" context
```

* * *
