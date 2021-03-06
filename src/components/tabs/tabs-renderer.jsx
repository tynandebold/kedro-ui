import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

/**
 * TabsRenderer, used to output the actual DOM markup for the component
 */
const TabsRenderer = ({
  onSelect,
  selectedIndex,
  size,
  tabs,
  theme
}) => {
  /**
   * Triggered when a tab is clicked
   * @param {HTMLElement} e The element that triggered the event
   * @param {Object} datum    Properties of the selected tab
   */
  const _handleSelect = (e, datum) => {
    onSelect(e, datum);
    // Only prevent default behaviour action if linking to an ID on page
    if (datum.href && datum.href[0] === '#') {
      e.preventDefault();
    }
  };

  /**
   * Remove special characters from a string and convert spaces to dashes.
   * This is necessary because each tab needs an ID so that it can be referenced
   * on each tab with `aria-labelledby` (see the demo page for an example).
   * @param  {string} str A text string
   * @return {string}     The same string, but sanitised for IDs
   */
  const _stringToID = str => str.toLowerCase()
    .replace(' ', '-')
    .replace(/[^a-zA-Z0-9]/g, '');

  /**
   * Render a link/button for each tab, depending on whether the tab is supplied
   * an href to link to, or whether it should just fire an onClick event.
   * @param  {Object} tab The datum prop for a given tab
   * @param  {number} i   Numerical index
   * @return {Object}     JSX element
   */
  const _renderTabButton = (tab, i) => {
    const props = {
      'aria-selected': `${selectedIndex === i}`,
      className: 'kui-tabs__button',
      id: `kui-tab-${_stringToID(tab.text)}`,
      onClick: e => _handleSelect(e, { selectedIndex: i, ...tab })
    };
    return tab.href ? (
      <a href={tab.href} target={tab.target} {...props}>{ tab.text }</a>
    ) : (
      <button {...props}>{ tab.text }</button>
    );
  };

  return (
    <div
      className={classnames(
        'kedro',
        'kui-tabs',
        `kui-theme--${theme}`,
        { 'kui-tabs--small': size === 'small' }
      )}>
      <ul className='kui-tabs__list'>
        {
          tabs.map((tab, i) => (
            <li
              key={tab.text}
              className={classnames('kui-tabs__tab', { 'kui-tabs__tab--selected': selectedIndex === i })}
              data-tabindex={i}>
              { _renderTabButton(tab, i) }
            </li>
          ))
        }
      </ul>
    </div>
  );
};

TabsRenderer.propTypes = {
  /**
   * Callback when tab is selected
   */
  onSelect: PropTypes.func.isRequired,
  /**
   * Sets the initially selected tab
   */
  selectedIndex: PropTypes.number.isRequired,
  /**
   * The tabs size, allowed [regular, small]
   */
  size: PropTypes.oneOf(['regular', 'small']).isRequired,
  /**
   * Tabs to display, and their (optional) URLs
   */
  tabs: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        text: PropTypes.string.isRequired,
        href: PropTypes.string
      })
    ])
  ).isRequired,
  /**
   * Theme name for component
   */
  theme: PropTypes.oneOf(['dark', 'light']).isRequired
};

export default TabsRenderer;
