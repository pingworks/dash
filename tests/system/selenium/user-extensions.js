/*
 * Copyright (C) 2013 pingworks - Alexander Birk und Christoph Lukas
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var rm = new RollupManager();

/*********************************************************************************************
 * EXTJS
 */

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
            command: 'assertElementNotPresent'
            , target: 'css=#' + args.id + ' .x-grid-row:nth-child(' + args.row + ') > td:nth-child(' + args.col + ') > .x-grid-cell-inner > ' + args.elem
        });
        return commands;
    }
});

/*
 * waitForGridCellContains
 */
rm.addRollupRule({
    name: 'waitForGridCellContains'
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
            command: 'clickAt'
            , target: 'css=#' + args.id + ' .x-grid-row:nth-child(' + args.row + ') > td:nth-child(' + args.col + ') > .x-grid-cell-inner'
        });
        return commands;
    }
});

/*
 * clickGridCellElement
 */
rm.addRollupRule({
    name: 'clickGridCellElement'
    , description: 'Clickt auf ein Element in einer Grid-Cell.'
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
            name: 'elem'
            , description: 'CSS Selector des Elements'
        }
    ]
    , commandMatchers: []
    , getExpandedCommands: function(args) {
        var commands = [];
        commands.push({
            command: 'clickAt'
            , target: 'css=#' + args.id + ' .x-grid-row:nth-child(' + args.row + ') > td:nth-child(' + args.col + ') > .x-grid-cell-inner > ' + args.elem
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
