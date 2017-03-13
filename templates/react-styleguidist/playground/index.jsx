import React, { PropTypes } from 'react';
import Editor from 'rsg-components/Editor';
import Preview from 'rsg-components/Preview';
import classnames from 'classnames';
import _ from 'lodash';

import './styles.css';

const _PlaygroundRenderer = ({ activeThemeIndex, code, grid, showCode, evalInContext, onChange, onCallbackFired, onCodeToggle, onGridToggled, onResetTapped, onThemeChanged, themes }) => {

  const themeable = true;///\stheme=/.test(code);
  const themedCodeBlocks = themeable ? _.map(themes, t => code.replace(/theme='light'/g, `theme='${t}'`)) : [];

	return (
    <div ref='playground' className='cbn-sg-playground'>
  		<div className={ classnames('cbn-sg-playground__preview', `cbn-theme--${themes[activeThemeIndex]}`, { 'cbn-sg-playground__preview--grid': grid }) }>

        {themeable
          ? _.map(themedCodeBlocks, (c, i) => (
            <section key={i} className={classnames('cbn-sg-playground__preview-section', `cbn-theme--${themes[i]}`, { 'cbn-sg-playground__preview-section--show': activeThemeIndex === i })}>
              <div className='cbn-sg-gutter'>
                <Preview code={c} evalInContext={evalInContext} onCallbackFired={onCallbackFired} />
              </div>
            </section>
          ))
          : <div className='cbn-sg-gutter'><Preview code={code} evalInContext={evalInContext} onCallbackFired={onCallbackFired} /></div>
        }

        <div className='cbn-sg-gutter'>
          <div className='cbn-sg-controls'>
            {showCode ? (
              <button className='cbn-sg-btn' type='button' onClick={onCodeToggle}>Hide code</button>
            ) : (
              <button className='cbn-sg-btn' type='button' onClick={onCodeToggle}>Show code</button>
            )}
            <button className='cbn-sg-btn' type='button' onClick={onGridToggled}>Baseline Grid</button>
            <button className='cbn-sg-btn' type='button' onClick={onResetTapped}>Reset</button>
            {themeable && (
              <Dropdown onChanged={onThemeChanged} theme={themes[activeThemeIndex]}>
                {_.map(themes, (t, i) => <MenuOption key={i} primaryText={t} value={i} selected={i === activeThemeIndex} />)}
              </Dropdown>
            )}
          </div>
        </div>
  		</div>
      <div className={ classnames('cbn-sg-playground__events', { 'cbn-sg-playground__events--open': true }) }>
        <div className='cbn-sg-gutter'>
  				Event Callbacks

        </div>
  		</div>
  		<div className={ classnames('cbn-sg-playground__code', { 'cbn-sg-playground__code--open': showCode }) }>
        <div className='cbn-sg-gutter'>
  				<Editor code={code} onChange={onChange} />
        </div>
  		</div>
  	</div>
  );

};

const PlaygroundRenderer = React.createClass({

  getInitialState() {
    return {
      activeThemeIndex: 0,
      grid: false,
      themes: ['light', 'dark']
    };
  },

  _handleEventCallbackFired(e) {
    console.warn('_handleEventCallbackFired', e);
  },

  _handleGridToggled() {
    this.setState({
      grid: !this.state.grid
    });
  },

  _handleResetTapped() {
    console.log('Implement reset');
  },

  _handleThemeChanged(e) {
    this.setState({
      activeThemeIndex: e.value
    })
  },

  render() {
    return _PlaygroundRenderer({
      ...this.props,
      activeThemeIndex: this.state.activeThemeIndex,
      grid: this.state.grid,
      onCallbackFired: this._handleEventCallbackFired,
      onGridToggled: this._handleGridToggled,
      onResetTapped: this._handleResetTapped,
      onThemeChanged: this._handleThemeChanged,
      themes: this.state.themes
    });
  }
});

PlaygroundRenderer.propTypes = {
	code: PropTypes.string.isRequired,
	showCode: PropTypes.bool.isRequired,
	evalInContext: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	onCodeToggle: PropTypes.func.isRequired
};

export default PlaygroundRenderer;
