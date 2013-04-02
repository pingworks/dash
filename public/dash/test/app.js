Ext.onReady(function() {
    Ext.application({
	    name: 'Dash',
	    models:[
	        'Branch',
	        'Bundle',
	        'Change',
	        'JobResult',
	        'JobStatus',
	        'StageStatus'
	    ],
	
	    views: [
	        'BundleGrid',
	        'ChangeToolTip',
	        'JobResultToolTip',
	        'StoreMenu',
	        'ToolTip',
	        'TopToolbar',
	        'Viewport'
	    ],
	
	    stores: [
	        'Branches',
	        'Bundles',
	        'Changes',
	        'JobResults',
	        'JobStatus',
	        'StageStatus'
	    ],
	
	    controllers: [
	        'Bundle',
	        'Change',
	        'JobResult'
	    ],

        launch: function() {
            //include the tests in the test.html head
            jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
            jasmine.getEnv().execute();
        }
    });
});