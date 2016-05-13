<a name="module_analytics"></a>

## analytics
Analytics module for CylinderClass.


* [analytics](#module_analytics)
    * [.options](#module_analytics.options) : <code>Object</code>
    * [.pageview(path)](#module_analytics.pageview)
    * [.event(category, action, [label], [value])](#module_analytics.event)


* * *

<a name="module_analytics.options"></a>

### analytics.options : <code>Object</code>
The options taken by the module.

**Kind**: static property of <code>[analytics](#module_analytics)</code>  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>debug</td><td><code>Boolean</code></td><td>If true, requests won't be sent.</td>
    </tr><tr>
    <td>log</td><td><code>Boolean</code></td><td>Should the module log into the console?</td>
    </tr>  </tbody>
</table>


* * *

<a name="module_analytics.pageview"></a>

### analytics.pageview(path)
Send an Analytics pageview to both <code>ga.js</code> and <code>analytics.js</code>.

**Kind**: static method of <code>[analytics](#module_analytics)</code>  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>path</td><td><code>String</code></td><td><p>The path to send to analytics.</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="module_analytics.event"></a>

### analytics.event(category, action, [label], [value])
Send an Analytics event to both <code>ga.js</code> and <code>analytics.js</code>.

**Kind**: static method of <code>[analytics](#module_analytics)</code>  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>category</td><td><code>String</code> | <code>Number</code></td><td><p>The event&#39;s category.</p>
</td>
    </tr><tr>
    <td>action</td><td><code>String</code> | <code>Number</code></td><td><p>The event&#39;s action.</p>
</td>
    </tr><tr>
    <td>[label]</td><td><code>String</code> | <code>Number</code></td><td><p>The event&#39;s label for that action.</p>
</td>
    </tr><tr>
    <td>[value]</td><td><code>String</code> | <code>Number</code></td><td><p>The event&#39;s value for that action.</p>
</td>
    </tr>  </tbody>
</table>


* * *

