'use strict';

import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Measure from 'react-measure';
import fuzzy from 'fuzzy';

import styles from './styles.scss';

export default class SearchBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: [],
      searchText: '',
      isOpen: false
    };
  }

  render() {
    const suggestions = fuzzy
      .filter(this.state.searchText || '', this.props.options || [], {
        extract: e => e.label
      })
      .map((r, i) => (
        <div className={styles.suggestion} key={i} onClick={() => this.select(r.original)}>
          {r.original.label}
        </div>
      ));

    return (
      <Measure bounds onResize={dims => this.setState({ dims })}>
        {({ measureRef }) => (
          <div ref={measureRef}>
            <div
              className={cx('control has-icons-right', {
                [styles.isOpen]: this.state.isOpen,
                [styles.hasValue]: !!this.state.value
              })}>
              <input
                className={cx('input')}
                type="text"
                placeholder={this.props.placeholder}
                value={this.state.searchText}
                onFocus={() => this.setState({ isOpen: true })}
                onBlur={() => this.cancel()}
                onChange={e => this.search(e.target.value)}
              />
              <span
                className={cx('icon', 'is-small is-right', styles.icon)}
                onClick={() => this.clear()}>
                <i
                  className={cx('fa', {
                    'fa-close': !!this.state.value,
                    'fa-search': !this.state.value
                  })}
                />
              </span>
              {this.state.isOpen &&
                <div className={cx(styles.suggestions)}>
                  {suggestions}
                </div>}
            </div>
          </div>
        )}
      </Measure>
    );
  }

  select(option) {
    this.setState({ searchText: option.label, isOpen: false, value: option.value });
    clearTimeout(this.cancelTimer);
    if (this.props.onChange) {
      this.props.onChange(option.value);
    }
  }

  cancel() {
    this.cancelTimer = setTimeout(() => {
      this.setState({ isOpen: false });
    }, 300);
  }

  clear() {
    this.setState({ searchText: '', value: null });
  }

  search(searchText) {
    this.setState({ searchText });
  }
}
