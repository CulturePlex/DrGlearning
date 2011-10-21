// jep @ Sencha Touch forums
Ext.namespace("Ext.jep");


Ext.jep.List = Ext.extend(Ext.List, {
  // Use displayIndexToRecordIndex in the list's itemTap handlers to convert between
  // the index in the handler (the display index) and the record index in the store.
  // this isn't always the same when you have a custom grouping function that causes
  // the store's to not sort identically to the display order (see bug report)
  displayIndexToRecordIndex: function (targetIndex) {
    if (this.grouped) {
      var groups = this.getStore().getGroups();
      
      for (var g = 0; g < groups.length; g++) {
        var group = groups[g].children;
        
        if (targetIndex < group.length)
          return this.getStore().indexOf(group[targetIndex]);
          
        targetIndex -= group.length;
      }  
    }
    else
      return targetIndex;
  },

  // Use this to convert the store's record index to the display index
  // for using the list's nodes directly via list.all.elements[i] or
  // in calls to list.getNode.
  recordIndexToDisplayIndex: function (targetIndex) {
    if (this.grouped) {
      var rec = this.getStore().getAt(targetIndex);

      var groups = this.getStore().getGroups();
      var currentIndex = 0;
      
      for (var g = 0; g < groups.length; g++) {
        var group = groups[g].children;
        
        for (var i = 0; i < group.length; i++)
          if (group[i] == rec)
            return currentIndex;
          else
            currentIndex++;
      }  
    }
    else
      return targetIndex;
  },
 
  // Fixes getNode so that if you pass it a store record, it will return the
  // proper node even when the grouping/sorting situations described above happen.
  getNode: function (nodeInfo) {
      if (Ext.isString(nodeInfo)) {
          return document.getElementById(nodeInfo);
      } else if (Ext.isNumber(nodeInfo)) {
          return this.all.elements[nodeInfo];
      } else if (nodeInfo instanceof Ext.data.Model) {
          var idx = this.recordIndexToDisplayIndex(this.store.indexOf(nodeInfo));
          return this.all.elements[idx];
      }
      return nodeInfo;
  },
  
  // Fixes getRecord so that it gets the proper store record even when the
  // grouping/sorting situations described above happen.
  getRecord: function(node){
    return this.store.getAt(this.displayIndexToRecordIndex(node.viewIndex));
  },
  
  // Fix for groupTpl not being able to accept an XTemplate
  initComponent : function() {
    Ext.jep.List.superclass.initComponent.apply(this);
    
    if (this.grouped && this.groupTpl && this.groupTpl.html) {
      this.tpl = new Ext.XTemplate(this.groupTpl.html, this.groupTpl.initialConfig);
    }
  },

  // Allows for dynamically switching between grouped/non-grouped
  setGrouped: function(grouped){
    // we have to save the itemTpl user functions first, which are in different place depending on grouping
    var memberFnsCombo = 
        (!this.grouped && this.tpl && this.tpl.initialConfig)
          ? this.tpl.initialConfig
          : ((this.grouped && this.listItemTpl && this.listItemTpl.initialConfig) ? this.listItemTpl.initialConfig : {});

    this.grouped = !!grouped;

    // the following is code copied from List.initComponent, slightly modified
    if (Ext.isArray(this.itemTpl)) {
        this.itemTpl = this.itemTpl.join('');
    } else if (this.itemTpl && this.itemTpl.html) {
        Ext.apply(memberFnsCombo, this.itemTpl.initialConfig);
        this.itemTpl = this.itemTpl.html;
    }
    
    if (!Ext.isDefined(this.itemTpl)) {
        throw new Error("Ext.List: itemTpl is a required configuration.");
    }
    // this check is not enitrely fool proof, does not account for spaces or multiple classes
    // if the check is done without "s then things like x-list-item-entity would throw exceptions that shouldn't have.
    if (this.itemTpl && this.itemTpl.indexOf("\"x-list-item\"") !== -1) {
        throw new Error("Ext.List: Using a CSS class of x-list-item within your own tpl will break Ext.Lists. Remove the x-list-item from the tpl/itemTpl");
    }
    
    this.tpl = '<tpl for="."><div class="x-list-item ' + this.itemCls + '"><div class="x-list-item-body">' + this.itemTpl + '</div>';
    if (this.onItemDisclosure) {
        this.tpl += '<div class="x-list-disclosure"></div>';
    }
    this.tpl += '</div></tpl>';
    this.tpl = new Ext.XTemplate(this.tpl, memberFnsCombo);
   

    if (this.grouped) {
        
        this.listItemTpl = this.tpl;
        if (Ext.isString(this.listItemTpl) || Ext.isArray(this.listItemTpl)) {
            // memberFns will go away after removal of tpl configuration for itemTpl
            // this copies memberFns by storing the original configuration.
            this.listItemTpl = new Ext.XTemplate(this.listItemTpl, memberFnsCombo);
        }
        if (Ext.isString(this.groupTpl) || Ext.isArray(this.groupTpl)) {
            this.tpl = new Ext.XTemplate(this.groupTpl);
        }
        // jep: this line added to original source
        else if (this.grouped && this.groupTpl && this.groupTpl.html) {
            this.tpl = new Ext.XTemplate(this.groupTpl.html, this.groupTpl.initialConfig);
        }
    }
    
    // jep: slightly modified from here
    this.updatePinHeaders();
    
    if (this.rendered)
      this.refresh();
  },

  updatePinHeaders: function() {
    if (this.rendered)
      if (this.grouped && this.pinHeaders)
        this.onScrollStart();
      else
        this.setActiveGroup();
  },

  onScrollStart: function() {
    if (this.grouped && this.pinHeaders && this.getStore().data.length)
      Ext.jep.List.superclass.onScrollStart.apply(this);
  },
  
  onScroll: function(scroller, pos, options) {
    if (this.grouped && this.pinHeaders && this.getStore().data.length)
      Ext.jep.List.superclass.onScroll.apply(this, [scroller, pos, options]);
  },
  
  setPinHeaders: function(pinHeaders) {
    this.pinHeaders = pinHeaders;
    this.updatePinHeaders();
  }
});

Ext.reg('jeplist', Ext.jep.List);