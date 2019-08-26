## Functions

<dl>
<dt><a href="#AddRule">AddRule(rule, oscdir, callback, opts)</a></dt>
<dd><p>Adds Rules for posterior execution or execution when the Editor changes.</p>
</dd>
<dt><a href="#Range">Range(start, end, callback)</a> ⇒ <code>Object</code></dt>
<dd><p>function for working with text in ranges.</p>
</dd>
<dt><a href="#Parse">Parse(rule, oscdir, callback, opts)</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Parses Regex patterns, if matches sends OSC messages.</p>
</dd>
<dt><a href="#Parse
String+Parse">Parse
String#Parse(oscdir, callback, opts)</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd></dd>
<dt><a href="#Loop">Loop(timeout, sequence, times)</a> ⇒ <code>Object</code></dt>
<dd><p>Loop function implementation, the loops are being declared with the exact sequence.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Tinalla">Tinalla</a></dt>
<dd><p>Tinalla main mother object.</p>
</dd>
</dl>

<a name="AddRule"></a>

## AddRule(rule, oscdir, callback, opts)
Adds Rules for posterior execution or execution when the Editor changes.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| rule | <code>RegExp</code> \| <code>String</code> \| <code>Object</code> |  | Regex Pattern, XRegExp is used here. |
| rule.pat | <code>RegExp</code> \| <code>String</code> |  | regex Pattern |
| rule.flags | <code>String</code> |  | regex flags |
| oscdir | <code>String</code> | <code>&quot;/tinalla&quot;</code> | OSC Address. |
| callback | <code>function</code> |  | function that executes when the pattern matches, the function receives an array of the matches. |
| opts | <code>Object</code> |  | options object. |
| opts.ip | <code>String</code> |  | ip of OSC Server. |
| opts.port | <code>Int</code> |  | port of OSC Server. |
| opts.start | <code>Object</code> |  | starting position of text, in the Codemirror format. |
| opts.start.line | <code>Int</code> | <code>0</code> | line position number. |
| opts.start.ch | <code>Int</code> | <code>0</code> | character position number. |
| opts.end.line | <code>Int</code> | <code>TextEditor.LineCount()</code> | line position number. |
| opts.end.ch | <code>Int</code> |  | character position number. |
| opts.onchange | <code>Bool</code> | <code>false</code> | parse when the text editor changes. |
| opts.iterable | <code>Bool</code> | <code>false</code> | calls the callback function per match, the function receives a res object instead of an array of matches. |

<a name="Range"></a>

## Range(start, end, callback) ⇒ <code>Object</code>
function for working with text in ranges.

**Kind**: global function  
**Returns**: <code>Object</code> - Object of functions.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| start | <code>Int</code> \| <code>Object</code> |  | start of range. |
| start.line | <code>Int</code> | <code>0</code> | line position number. |
| start.ch | <code>Int</code> | <code>0</code> | character position number. |
| end | <code>Int</code> |  | ending line number of range. |
| end.line | <code>Int</code> | <code>TextEditor.LineCount()</code> | line position number. |
| end.ch | <code>Int</code> |  | character position number. |
| callback | <code>function</code> |  | function that executes when the pattern matches, the function receives an array of the matches. |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| res | <code>Object</code> | res result. |
| res.Parse | <code>function</code> | Parse function into text range. |
| res.AddRule | <code>function</code> | AddRule function into text range. |

<a name="Parse"></a>

## Parse(rule, oscdir, callback, opts) ⇒ <code>Array.&lt;Object&gt;</code>
Parses Regex patterns, if matches sends OSC messages.

**Kind**: global function  
**Returns**: <code>Array.&lt;Object&gt;</code> - Array of matches  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| rule | <code>RegExp</code> \| <code>String</code> \| <code>Object</code> |  | Regex Pattern, XRegExp is used here. |
| rule.pat | <code>RegExp</code> \| <code>String</code> |  | regex Pattern |
| rule.flags | <code>String</code> |  | regex flags |
| oscdir | <code>String</code> | <code>&quot;/tinalla&quot;</code> | OSC Address. |
| callback | <code>function</code> |  | function that executes when the pattern matches, the function receives an array of the matches. |
| opts | <code>Object</code> |  | options object. |
| opts.ip | <code>String</code> |  | ip of OSC Server. |
| opts.port | <code>Int</code> |  | port of OSC Server. |
| opts.start | <code>Object</code> |  | starting position of text, in the Codemirror format. |
| opts.start.line | <code>Int</code> | <code>0</code> | line position number. |
| opts.start.ch | <code>Int</code> | <code>0</code> | character position number. |
| opts.end.line | <code>Int</code> | <code>TextEditor.LineCount()</code> | line position number. |
| opts.end.ch | <code>Int</code> |  | character position number. |
| opts.onchange | <code>Bool</code> | <code>false</code> | parse when the text editor changes. |
| opts.iterable | <code>Bool</code> | <code>false</code> | calls the callback function per match, the function receives a res object instead of an array of matches. |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| res | <code>Object</code> | match result. |
| res.start | <code>Object</code> | starting position of match, in the Codemirror format. |
| res.start.line | <code>Int</code> | line position number. |
| res.start.ch | <code>Int</code> | character position number. |
| res.end.line | <code>Int</code> | line position number. |
| res.end.ch | <code>Int</code> | character position number. |
| res.res | <code>String</code> | string match result. |
| res.raw | <code>Array</code> | resulting array in the XRegExp format. |

<a name="Parse
String+Parse"></a>

## Parse
String#Parse(oscdir, callback, opts) ⇒ <code>Array.&lt;Object&gt;</code>
**Kind**: global function  
**Returns**: <code>Array.&lt;Object&gt;</code> - Array of matches  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| oscdir | <code>String</code> | <code>&quot;/tinalla&quot;</code> | OSC Address. |
| callback | <code>function</code> |  | function that executes when the pattern matches, the function receives an array of the matches. |
| opts | <code>Object</code> |  | options object. |
| opts.ip | <code>String</code> |  | ip of OSC Server. |
| opts.port | <code>Int</code> |  | port of OSC Server. |
| opts.start | <code>Object</code> |  | starting position of text, in the Codemirror format. |
| opts.start.line | <code>Int</code> | <code>0</code> | line position number. |
| opts.start.ch | <code>Int</code> | <code>0</code> | character position number. |
| opts.end.line | <code>Int</code> | <code>TextEditor.LineCount()</code> | line position number. |
| opts.end.ch | <code>Int</code> |  | character position number. |
| opts.onchange | <code>Bool</code> | <code>false</code> | parse when the text editor changes. |
| opts.iterable | <code>Bool</code> | <code>false</code> | calls the callback function per match, the function receives a res object instead of an array of matches. |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| res | <code>Object</code> | match result. |
| res.start | <code>Object</code> | starting position of match, in the Codemirror format. |
| res.start.line | <code>Int</code> | line position number. |
| res.start.ch | <code>Int</code> | character position number. |
| res.end.line | <code>Int</code> | line position number. |
| res.end.ch | <code>Int</code> | character position number. |
| res.res | <code>String</code> | string match result. |
| res.raw | <code>Array</code> | resulting array in the XRegExp format. |

<a name="Loop"></a>

## Loop(timeout, sequence, times) ⇒ <code>Object</code>
Loop function implementation, the loops are being declared with the exact sequence.

**Kind**: global function  
**Returns**: <code>Object</code> - - Object of functions for loop control.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| timeout | <code>Int</code> |  | time delay, if the timeout changes while being played, the loop will change it's timeout. |
| sequence | <code>Array.&lt;function()&gt;</code> |  | Array of functions to be executed, the exact sequence will define the loop, if the sequence changes, this will create another different loop. |
| times | <code>Int</code> \| <code>String</code> | <code>&quot;inf&quot;</code> | times that the loop should be executed (not implemented yet). |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| res | <code>Object</code> | resulting object |
| res.play | <code>function</code> | play function for the loop. |
| res.stop | <code>function</code> | stops the loop. |

<a name="Tinalla"></a>

## Tinalla
Tinalla main mother object.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| Tinalla.loops | <code>Proxy</code> | contains a reference of each loop created. |
| Tinalla.rules | <code>Proxy</code> | contains a reference of each regex rule created. |

