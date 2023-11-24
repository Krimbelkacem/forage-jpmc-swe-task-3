import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import { DataManipulator } from './DataManipulator';
import './Graph.css';

interface IProps {
  data: ServerRespond[],
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}
class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    // Get element from the DOM
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    const schema = {
      stock: 'string',
      top_ask_price: 'float',
      top_bid_price: 'float',
      timestamp: 'date',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }

    if (this.table) {
      elem.load(this.table);
      // Customize the view based on user preferences or trader requirements
      elem.setAttribute('view', 'y_line');
      elem.setAttribute('column-pivots', '["stock"]');
      elem.setAttribute('row-pivots', '["timestamp"]');
      elem.setAttribute('columns', '["top_ask_price"]');
      elem.setAttribute('aggregates', JSON.stringify({
        stock: 'distinctcount',
        top_ask_price: 'avg',
        top_bid_price: 'avg',
        timestamp: 'distinct count',
      }));

      // Add interactivity or additional settings as needed
      elem.setAttribute('editable', 'true');
      elem.setAttribute('sort', '["timestamp"]');
      elem.setAttribute('theme', 'material-dark');
      if (elem) {
        const schema = {
          stock: 'string',
          top_ask_price: 'float',
          top_bid_price: 'float',
          timestamp: 'date',
        };
    
        if (window.perspective && window.perspective.worker()) {
          this.table = window.perspective.worker().table(schema);
        }
    
        if (this.table) {
          elem.load(this.table);
          // Other configurations...
        }
      } else {
        console.error("Element 'perspective-viewer' not found in the DOM.");
      }
    }
  }

  componentDidUpdate(prevProps: IProps) {
    if (this.table && this.props.data !== prevProps.data) {
      // Update the table with new data when props change
      this.table.update(
        DataManipulator.generateRow(this.props.data),
      );
    }
  }
}

export default Graph;
