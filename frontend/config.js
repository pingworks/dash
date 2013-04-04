var Dash = {};

Dash.config = {
    toolbar: {
        left: [{
            xtype: 'component',
            width: 48,
            height: 38,
            html: '<img src="resources/img/icons/Dashboard-green.png" />'
        }, {
            xtype: 'component',
            html: '&nbsp;',
            width: 10
        }, {
            xtype: 'component',
            html: 'Dashboard',
            style: 'font-size: 32px'
        }],
        links: [{
            text: 'Jenkins',
            url: 'https://dash.pingworks.net/jenkins/'
        }, {
            text: 'Repo',
            url: 'https://dash.pingworks.net/repo/'
        }]
    },
    
    bundlegrid: {
        title: 'Bundles im Branch: {0}',
        dateformat: 'd.m.Y H:i:s',
        icon: {
            change: 'resources/img/icons/change.png',
            deploy: 'resources/img/icons/deploy.png'
        },
        repolink: '<a href="https://dash.pingworks.net/repo/{0}/{1}" target="_blank" style="color: black">{1}</a>',
        vcslink: '<a href="https://dash.pingworks.net/git/?p=dash.git;a=commit;h={0}" target="_blank" style="color: black">{0}</a>',
        sort: {
            field: 'timestamp',
            dir: 'DESC'
        },
        reload: 300000 // 5 min
    },
    
    branch: {
        endpoint: '/branch'
    },
    
    bundle: {
        endpoint: '/bundle',
        dateformat: 'Y-m-d_H:i:s'
    },
    
    change: {
        endpoint: '/change',
        title: 'Änderungen in Bundle {0}' 
    },
    
    stagestatus: {
        iconpath: 'resources/img/icons/status/{0}',
        data: [
            {
                'id': 0,
                'name': 'not running',
                'icon': 'grey.png'
            },
            {
                'id': 1,
                'name': 'in progress',
                'icon': 'green-ani.gif'
            },
            {
                'id': 2,
                'name': 'failed',
                'icon': 'red.png'
            },
            {
                'id': 3,
                'name': 'success',
                'icon': 'green.png'
            }
        ]
    },

    jobstatus: {
        iconpath: 'resources/img/icons/status/{0}',
        data: [
            {
                'id': '-',
                'name': 'not running',
                'icon': 'grey.png'
            },
            {
                'id': 'UNSTABLE',
                'name': 'unstable',
                'icon': 'yellow.png'
            },
            {
                'id': 'FAILURE',
                'name': 'failed',
                'icon': 'red.png'
            },
            {
                'id': 'SUCCESS',
                'name': 'success',
                'icon': 'green.png'
            }
        ]
    },
    
    jobresult: {
        endpoint: '/jobresult',
        text: '<img src="{6}" alt="{2}">&nbsp;' 
            + '<a href="https://dash.pingworks.net/jenkins/{1}" target="_blank">{0}</a>: Tests: {3}, skipped: {4}, failed: {5}',
        title: '{1} stage Jobs für Bundle {2}',
        stageMap: {
            1: 'First',
            2: 'Second',
            3: 'Third'
        }
    },
    
    error: {
        title: 'Fehler',
        msg: 'Die Daten konnten nicht geladen werden.'
    }
    
}
