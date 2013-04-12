
var rm = new RollupManager();

/*********************************************************************************************
 * EXTJS
 */

/*
 * clickTwintrigger
 */
rm.addRollupRule({
    name: 'clickTwintrigger'
    , description: 'Klickt auf einen der beiden Buttons eines Twintriggers.'
    , args: [
        {
            name: 'id'
            , description: 'Id des Elements'
        }, {
            name: 'nr'
            , description: 'Nr/Position des Buttons'
        }
    ]
    , commandMatchers: []
    , getExpandedCommands: function(args) {
        var commands = [];
        commands.push({
            command: 'click'
            , target: 'css=#x-form-el-' + args.id + ' > div > span > img:nth-child(' + args.nr + ')'
        });
        return commands;
    }
});

/*
 * toggleTwintrigger
 */
rm.addRollupRule({
    name: 'toggleTwintrigger'
    , description: 'Klappt eine Twintrigger-Box auf oder zu.'
    , args: [
        {
            name: 'id'
            , description: 'Id des Elements'
        }
    ]
    , commandMatchers: []
    , getExpandedCommands: function(args) {
        var commands = [];
        commands.push({
            command: 'click'
            , target: 'css=#x-form-el-' + args.id + ' > div > span > img:nth-child(2)'
        });
        return commands;
    }
});

/*
 * clearTwintrigger
 */
rm.addRollupRule({
    name: 'clearTwintrigger'
    , description: 'Loescht die Auswahl einer Twintrigger-Box.'
    , args: [
        {
            name: 'id'
            , description: 'Id des Elements'
        }
    ]
    , commandMatchers: []
    , getExpandedCommands: function(args) {
        var commands = [];
        commands.push({
            command: 'click'
            , target: 'css=#x-form-el-' + args.id + ' > div > span > img:nth-child(1)'
        });
        commands.push({
            command: 'waitForValue'
            , target: args.id
            , value: ''
        });
        return commands;
    }
});

/*
 * clickTwintriggerElement
 */
rm.addRollupRule({
    name: 'clickTwintriggerElement'
    , description: 'Clickt auf ein Listenelement einer offenen Twintrigger-Box.'
    , args: [
        {
            name: 'id'
            , description: 'Id des Elements'
        }
        , {
            name: 'nr'
            , description: 'Nr des Listenelements'
        }
    ]
    , commandMatchers: []
    , getExpandedCommands: function(args) {
        var commands = [];
        commands.push({
            command: 'rollup'
            , target: 'clickComboElement'
            , value: to_kwargs({ id: args.id, nr: args.nr })
        });
        return commands;
    }
});

/*
 * assertTwintriggerElementText
 */
rm.addRollupRule({
    name: 'assertTwintriggerElementText'
    , description: 'Prueft den Text eines Listenelements.'
    , args: [
        {
            name: 'id'
            , description: 'Id des Elements'
        }
        , {
            name: 'nr'
            , description: 'Nr des Listenelements'
        }
        , {
            name: 'value'
            , description: 'Erwarteter Text'
        }
    ]
    , commandMatchers: []
    , getExpandedCommands: function(args) {
        var commands = [];
        commands.push({
            command: 'rollup'
            , target: 'assertComboElementText'
            , value: to_kwargs({ id: args.id, nr: args.nr, value: args.value})
        });
        return commands;
    }
});

/*
 * waitForTwintriggerElement
 */
rm.addRollupRule({
    name: 'waitForTwintriggerElement'
    , description: 'Wartet auf das Erscheinen eines vom Server geladenen Listenelements.'
    , args: [
        {
            name: 'id'
            , description: 'Id des Elements'
        }
        , {
            name: 'nr'
            , description: 'Nr des Elements'
        }
        , {
            name: 'value'
            , description: 'Erwarteter Text'
        }
    ]
    , commandMatchers: []
    , getExpandedCommands: function(args) {
        var commands = [];
        commands.push({
            command: 'waitForElementPresent'
            , target: 'css=#' + args.id + '-list > div:nth-child(' + args.nr + ')'
        });
        commands.push({
            command: 'waitForTextPresent'
            , target: args.value
        });
        return commands;
    }
});

/*
 * selectTwintriggerElement
 */
rm.addRollupRule({
    name: 'selectTwintriggerElement'
    , description: 'Oeffnet eine Twintrigger-Box und waehlt ein Listenelement aus.'
    , args: [
        {
            name: 'id'
            , description: 'Id des Elements'
        }
        , {
            name: 'nr'
            , description: 'Nr des Elements'
        }
        , {
            name: 'value'
            , description: 'Text der nach Auswahl im Feld stehen muss'
        }
        , {
            name: 'wait'
            , description: 'Flag, ob auf Erscheinen des Listenelements gewartet werden muss'
        }
    ]
    , commandMatchers: []
    , getExpandedCommands: function(args) {
        var commands = [];
        commands.push({
            command: 'rollup'
            , target: 'toggleTwintrigger'
            , value: to_kwargs({ id: args.id })
        });
        if (args.wait) {
            commands.push({
                command: 'rollup'
                , target: 'waitForTwintriggerElement'
                , value: to_kwargs({ id: args.id, nr: args.nr, value: args.value })
            });
        }
        commands.push({
            command: 'rollup'
            , target: 'clickTwintriggerElement'
            , value: to_kwargs({ id: args.id, nr: args.nr })
        });
        if (args.value) {
            commands.push({
                command: 'waitForValue'
                , target: args.id
                , value: args.value
            });
        }
        return commands;
    }
});

/*
 * toggleCombo
 */
rm.addRollupRule({
    name: 'toggleCombo'
    , description: 'Klappt eine Combo-Box auf oder zu.'
    , args: [
        {
            name: 'id'
            , description: 'Id des Elements'
        }
    ]
    , commandMatchers: []
    , getExpandedCommands: function(args) {
        var commands = [];
        commands.push({
            command: 'click'
            , target: 'css=input#' + args.id + ' + img.x-form-trigger'
        });
        return commands;
    }
});

/*
 * clickComboElement
 */
rm.addRollupRule({
    name: 'clickComboElement'
    , description: 'Clickt auf ein Listenelement einer offenen Combo-Box.'
    , args: [
        {
            name: 'id'
            , description: 'Id des Elements'
        }
        , {
            name: 'nr'
            , description: 'Nr des Elements'
        }
    ]
    , commandMatchers: []
    , getExpandedCommands: function(args) {
        var commands = [];
        commands.push({
            command: 'click'
            , target: 'css=#' + args.id + '-list > div:nth-child(' + args.nr + ')'
        });
        return commands;
    }
});

/*
 * assertComboElementText
 */
rm.addRollupRule({
    name: 'assertComboElementText'
    , description: 'Prueft den Text eines Listenelements.'
    , args: [
        {
            name: 'id'
            , description: 'Id des Elements'
        }
        , {
            name: 'nr'
            , description: 'Nr des Listenelements'
        }
        , {
            name: 'value'
            , description: 'Erwarteter Text'
        }
    ]
    , commandMatchers: []
    , getExpandedCommands: function(args) {
        var commands = [];
        commands.push({
            command: 'assertText'
            , target: 'css=#' + args.id + '-list > div:nth-child(' + args.nr + ')'
            , value: args.value
        });
        return commands;
    }
});

/*
 * assertComboElementPresent
 */
rm.addRollupRule({
    name: 'assertComboElementPresent'
    , description: 'Prueft ob ein Listenelement vorhanden ist.'
    , args: [
        {
            name: 'id'
            , description: 'Id des Elements'
        }
        , {
            name: 'nr'
            , description: 'Nr des Listenelements'
        }
    ]
    , commandMatchers: []
    , getExpandedCommands: function(args) {
        var commands = [];
        commands.push({
            command: 'assertElementPresent'
            , target: 'css=#' + args.id + '-list > div:nth-child(' + args.nr + ')'
            , value: args.value
        });
        return commands;
    }
});

/*
 * assertComboElementNotPresent
 */
rm.addRollupRule({
    name: 'assertComboElementNotPresent'
    , description: 'Prueft ob ein Listenelement nicht vorhanden ist.'
    , args: [
        {
            name: 'id'
            , description: 'Id des Elements'
        }
        , {
            name: 'nr'
            , description: 'Nr des Listenelements'
        }
    ]
    , commandMatchers: []
    , getExpandedCommands: function(args) {
        var commands = [];
        commands.push({
            command: 'assertElementNotPresent'
            , target: 'css=#' + args.id + '-list > div:nth-child(' + args.nr + ')'
            , value: args.value
        });
        return commands;
    }
});

/*
 * selectComboElement
 */
rm.addRollupRule({
    name: 'selectComboElement'
    , description: 'Oeffnet eine Combo-Box und waehlt ein Listenelement aus.'
    , args: [
        {
            name: 'id'
            , description: 'Id des Elements'
        }
        , {
            name: 'nr'
            , description: 'Nr des Listenelements'
        }
        , {
            name: 'value'
            , description: 'Text der nach der Auswahl im Feld stehen muss'
        }
    ]
    , commandMatchers: []
    , getExpandedCommands: function(args) {
        var commands = [];
        commands.push({
            command: 'rollup'
            , target: 'toggleCombo'
            , value: to_kwargs({ id: args.id })
        });
        commands.push({
            command: 'rollup'
            , target: 'clickComboElement'
            , value: to_kwargs({ id: args.id, nr: args.nr })
        });
        commands.push({
            command: 'waitForValue'
            , target: args.id
            , value: args.value
        });
        return commands;
    }
});

/*
 * closeWindow
 */
rm.addRollupRule({
    name: 'closeWindow'
    , description: 'Schliesst ein Fenster'
    , args: [
        {
            name: 'id'
            , description: 'Id des Elements'
        }
    ]
    , commandMatchers: []
    , getExpandedCommands: function(args) {
        var commands = [];
        commands.push({
            command: 'click'
            , target: 'css=#' + args.id + ' .x-tool-close'
        });
        return commands;
    }
});

/*
 * maximizeWindow
 */
rm.addRollupRule({
    name: 'maximizeWindow'
    , description: 'Maximiert ein Fenster'
    , args: [
        {
            name: 'id'
            , description: 'Id des Elements'
        }
    ]
    , commandMatchers: []
    , getExpandedCommands: function(args) {
        var commands = [];
        commands.push({
            command: 'click'
            , target: 'css=#' + args.id + ' .x-tool-maximize'
        });
        return commands;
    }
});

/*
 * clickSaveIconOnWindowToolbar
 */
rm.addRollupRule({
    name: 'clickSaveIconOnWindowToolbar'
    , description: 'Klickt auf das kleine Save-Icon in der Fenster-Toolbar und wartet auf den Toast'
    , args: [
        {
            name: 'id'
            , description: 'Id des Elements'
        }
    ]
    , commandMatchers: []
    , getExpandedCommands: function(args) {
        var commands = [];
        commands.push({
            command: 'click'
            , target: 'css=#' + args.id + ' .x-tool-save'
        });
        commands.push({
            command: 'waitForTextPresent'
            , target: 'nderungen wurden erfolgreich '
        });
        return commands;
    }
});

/*
 * waitForGridCellPresent
 */
rm.addRollupRule({
    name: 'waitForGridCellPresent'
    , description: 'Wartet auf das Erscheinen einer Grid-Cell'
    , args: [
        {
            name: 'id'
            , description: 'Id des Elements'
        }
        , {
            name: 'row'
            , description: 'Zeilennummer'
        }
        , {
            name: 'col'
            , description: 'Spaltennummer'
        }
    ]
    , commandMatchers: []
    , getExpandedCommands: function(args) {
        var commands = [];
        commands.push({
            command: 'waitForElementPresent'
            , target: 'css=#' + args.id + ' .x-grid-row:nth-child(' + args.row + ') > td:nth-child(' + args.col + ') > .x-grid-cell-inner'
        });
        return commands;
    }
});

/*
 * assertGridCellNotPresent
 */
rm.addRollupRule({
    name: 'assertGridCellNotPresent'
    , description: 'Prüft ob eine Grid-Cell nicht vorhanden ist'
    , args: [
        {
            name: 'id'
            , description: 'Id des Elements'
        }
        , {
            name: 'row'
            , description: 'Zeilennummer'
        }
        , {
            name: 'col'
            , description: 'Spaltennummer'
        }
    ]
    , commandMatchers: []
    , getExpandedCommands: function(args) {
        var commands = [];
        commands.push({
            command: 'assertElementNotPresent'
            , target: 'css=#' + args.id + ' .x-grid-row:nth-child(' + args.row + ') > td:nth-child(' + args.col + ') > .x-grid-cell-inner'
        });
        return commands;
    }
});

/*
 * assertGridCellText
 */
rm.addRollupRule({
    name: 'assertGridCellText'
    , description: 'Prueft ob eine Grid-Cell einen Text enthaelt'
    , args: [
        {
            name: 'id'
            , description: 'Id des Elements'
        }
        , {
            name: 'row'
            , description: 'Zeilennummer'
        }
        , {
            name: 'col'
            , description: 'Spaltennummer'
        }
        , {
            name: 'value'
            , description: 'Erwarteter Text'
        }
    ]
    , commandMatchers: []
    , getExpandedCommands: function(args) {
        var commands = [];
        commands.push({
            command: 'assertText'
            , target: 'css=#' + args.id + ' .x-grid-row:nth-child(' + args.row + ') > td:nth-child(' + args.col + ') > .x-grid-cell-inner'
            , value: args.value
        });
        return commands;
    }
});

/*
 * assertNotGridCellText
 */
rm.addRollupRule({
    name: 'assertNotGridCellText'
    , description: 'Prueft ob eine Grid-Cell nicht einen Text enthaelt'
    , args: [
        {
            name: 'id'
            , description: 'Id des Elements'
        }
        , {
            name: 'row'
            , description: 'Zeilennummer'
        }
        , {
            name: 'col'
            , description: 'Spaltennummer'
        }
        , {
            name: 'value'
            , description: 'Erwarteter Text'
        }
    ]
    , commandMatchers: []
    , getExpandedCommands: function(args) {
        var commands = [];
        commands.push({
            command: 'assertNotText'
            , target: 'css=#' + args.id + ' .x-grid-row:nth-child(' + args.row + ') > td:nth-child(' + args.col + ') > .x-grid-cell-inner'
            , value: args.value
        });
        return commands;
    }
});

/*
 * waitForGridCellText
 */
rm.addRollupRule({
    name: 'waitForGridCellText'
    , description: 'Wartet auf das Erscheinene eines Textes in einer Grid-Cell.'
    , args: [
        {
            name: 'id'
            , description: 'Id des Elements'
        }
        , {
            name: 'row'
            , description: 'Zeilennummer'
        }
        , {
            name: 'col'
            , description: 'Spaltennummer'
        }
        , {
            name: 'value'
            , description: 'Erwarteter Text'
        }
    ]
    , commandMatchers: []
    , getExpandedCommands: function(args) {
        var commands = [];
        commands.push({
            command: 'rollup'
            , target: 'waitForGridCellPresent'
            , value: to_kwargs({ id: args.id, row: args.row, col: args.col })
        });
        commands.push({
            command: 'waitForText'
            , target: 'css=#' + args.id + ' .x-grid-row:nth-child(' + args.row + ') > td:nth-child(' + args.col + ') > .x-grid-cell-inner'
            , value: args.value
        });
        return commands;
    }
});

/*
 * assertGridCellContains
 */
rm.addRollupRule({
    name: 'assertGridCellContains'
    , description: 'Prueft ob eine Grid-Cell ein Element enthaelt'
    , args: [
        {
            name: 'id'
            , description: 'Id des Grids'
        }
        , {
            name: 'row'
            , description: 'Zeilennummer'
        }
        , {
            name: 'col'
            , description: 'Spaltennummer'
        }
        , {
            name: 'elem'
            , description: 'CSS Selector des Elements'
        }
    ]
    , commandMatchers: []
    , getExpandedCommands: function(args) {
        var commands = [];
        commands.push({
            command: 'assertElementPresent'
            , target: 'css=#' + args.id + ' .x-grid-row:nth-child(' + args.row + ') > td:nth-child(' + args.col + ') > .x-grid-cell-inner > ' + args.elem
        });
        return commands;
    }
});

/*
 * assertGridCellNotContains
 */
rm.addRollupRule({
    name: 'assertGridCellNotContains'
    , description: 'Prueft ob eine Grid-Cell ein Element enthaelt'
    , args: [
        {
            name: 'id'
            , description: 'Id des Grids'
        }
        , {
            name: 'row'
            , description: 'Zeilennummer'
        }
        , {
            name: 'col'
            , description: 'Spaltennummer'
        }
        , {
            name: 'elem'
            , description: 'CSS Selector des Elements'
        }
    ]
    , commandMatchers: []
    , getExpandedCommands: function(args) {
        var commands = [];
        commands.push({
            command: 'assertNotElementPresent'
            , target: 'css=#' + args.id + ' .x-grid-row:nth-child(' + args.row + ') > td:nth-child(' + args.col + ') > .x-grid-cell-inner > ' + args.elem
        });
        return commands;
    }
});

/*
 * waitForGridCellContains
 */
rm.addRollupRule({
    name: 'waitGridCellContains'
    , description: 'Prueft ob eine Grid-Cell ein Element enthaelt'
    , args: [
        {
            name: 'id'
            , description: 'Id des Grids'
        }
        , {
            name: 'row'
            , description: 'Zeilennummer'
        }
        , {
            name: 'col'
            , description: 'Spaltennummer'
        }
        , {
            name: 'elem'
            , description: 'CSS Selector des Elements'
        }
    ]
    , commandMatchers: []
    , getExpandedCommands: function(args) {
        var commands = [];
        commands.push({
            command: 'waitForElementPresent'
            , target: 'css=#' + args.id + ' .x-grid-row:nth-child(' + args.row + ') > td:nth-child(' + args.col + ') > .x-grid-cell-inner > ' + args.elem
        });
        return commands;
    }
});

/*
 * clickGridCell
 */
rm.addRollupRule({
    name: 'clickGridCell'
    , description: 'Clickt auf eine Grid-Cell.'
    , args: [
        {
            name: 'id'
            , description: 'Id des Elements'
        }
        , {
            name: 'row'
            , description: 'Zeilennummer'
        }
        , {
            name: 'col'
            , description: 'Spaltennummer'
        }
    ]
    , commandMatchers: []
    , getExpandedCommands: function(args) {
        var commands = [];
        commands.push({
            command: 'mouseDownAt'
            , target: 'css=#' + args.id + ' .x-grid-row:nth-child(' + args.row + ') > td:nth-child(' + args.col + ') > .x-grid-cell-inner'
        });
        return commands;
    }
});

/*
 * dblClickGridCell
 */
rm.addRollupRule({
    name: 'dblClickGridCell'
    , description: 'Doppelclickt auf eine Grid-Cell.'
    , args: [
        {
            name: 'id'
            , description: 'Id des Elements'
        }
        , {
            name: 'row'
            , description: 'Zeilennummer'
        }
        , {
            name: 'col'
            , description: 'Spaltennummer'
        }
    ]
    , commandMatchers: []
    , getExpandedCommands: function(args) {
        var commands = [];
        commands.push({
            command: 'doubleClick'
            , target: 'css=#' + args.id + ' .x-grid-row:nth-child(' + args.row + ') > td:nth-child(' + args.col + ') > .x-grid-cell-inner'
        });
        return commands;
    }
});

/*
 * clickRowAction
 */
rm.addRollupRule({
    name: 'clickRowAction'
    , description: 'Clickt eine Row-Action.'
    , args: [
        {
            name: 'id'
            , description: 'Id des Elements'
        }
        , {
            name: 'row'
            , description: 'Zeilennummer'
        }
        , {
            name: 'col'
            , description: 'Spaltennummer'
        }
        , {
            name: 'action'
            , description: 'Name der Action: iconCls ohne icon-application-'
        }
    ]
    , commandMatchers: []
    , getExpandedCommands: function(args) {
        var commands = [];
        commands.push({
            command: 'waitForElementPresent'
            , target: 'css=#' + args.id + ' .x-grid-row:nth-child(' + args.row + ') > td:nth-child(' + args.col + ') > .x-grid3-cell-inner > div .ux-row-action-item.icon-application-' + args.action
        });
        commands.push({
            command: 'click'
            , target: 'css=#' + args.id + ' .x-grid-row:nth-child(' + args.row + ') > td:nth-child(' + args.col + ') > .x-grid3-cell-inner > div .ux-row-action-item.icon-application-' + args.action
        });
        return commands;
    }
});

/*
 * clickMenuElement
 */
rm.addRollupRule({
    name: 'clickMenuElement'
    , description: 'Clickt auf ein Menu-Element'
    , args: [
        {
            name: 'id'
            , description: 'Id des Parent-Elements'
            , exampleValues: ['x-mainmenu', 'vertrag_le_add_button']
        }
        , {
            name: 'entry'
            , description: 'Liste der Menu-Elemente'
            , exampleValues: ['menu_vertrag|menu_vertrag_neu', 'vertrag_le_add_button|vertrag_le_ik_stamm_add']
        }
        , {
            name: 'element'
            , description: 'Id des Elements auf dessen Erscheinen nach dem Anlicken gewartet weden soll'
        }
    ]
    , commandMatchers: []
    , getExpandedCommands: function(args) {
        var commands = [];
        commands.push({
            command: 'waitForElementPresent'
            , target: args.id
        });
        commands.push({
            command: 'waitForVisible'
            , target: args.id
        });
        if (args.entry) {
            var subEntries = args.entry.split('|');
            for(var i=0; i<subEntries.length; i++){
                commands.push({
                    command: 'waitForElementPresent'
                    , target: subEntries[i]
                });
                commands.push({
                    command: 'waitForVisible'
                    , target: subEntries[i]
                });
                var cmd = (i == subEntries.length - 1 || i == 0) ? 'click' : 'mouseOver';
                commands.push({
                    command: cmd
                    , target: subEntries[i]
                });
            }
        }
        if (args.element) {
            commands.push({
                command: 'waitForElementPresent'
                , target: args.element
            });
            commands.push({
                command: 'waitForVisible'
                , target: args.element
            });
        }
        return commands;
    }
});


