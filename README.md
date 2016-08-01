# Hotpath
Hotpath is a solution for collecting and analyzing Patient Reported Outcomes (PRO). Hotpath consists of a viewer and editor. The viewer is used to serve surveys and submits results to a specified endpoint for scoring and analysis. The viewer can be used with our open source collection of standardized surveys. The editor is a visual tool for editing surveys. Within the editor, you can create your own surveys and set up the weighting of answer options.

# Development

Hotpath consists of two single-page Angular 1.5 apps (viewer and editor), as well as static web pages.

## Install
   `npm install`

## Run
   `gulp`

## Angular Dependencies

[ng-flow](https://github.com/flowjs/ng-flow) - To support file upload and drag 'n drop images

[angular-content-editable](https://github.com/codekraft-studio/angular-content-editable) - To support inline text/html editing

[ng-sortable](https://github.com/a5hik/ng-sortable) - To support reordering content by dragging
