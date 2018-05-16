import React from 'react';

const capitalize = ( string ) => string.substr( 0, 1 ).toUpperCase() + string.substr( 1 );

const Editor = ( {
	script,
	edit,
	greyscale,
	subjects,
	maxSections,
	sortedList,
	pageCounts,
	indexPage,
	titlePage,
} ) => {
	return (
		<aside>
      <label>
        <span>Script</span>
        <select value={ script } data-func="script" onChange={ edit }>
          <option value="voynich">Voynich</option>
          <option value="rune">Rune</option>
        </select>
      </label>
      <label>
        <span>Force greyscale? { greyscale ? 'Yes' : 'No' }</span>
        <input type="checkbox" data-func="forceGreyScale" checked={ greyscale } onChange={ edit } />
      </label>
      <label>
        <span>Title page? { titlePage ? 'Yes' : 'No' }</span>
        <input type="checkbox" data-func="titlePage" checked={ titlePage } onChange={ edit } />
      </label>
      <label>
        <span>Table of contents? { indexPage ? 'Yes' : 'No' }</span>
        <input type="checkbox" data-func="indexPage" checked={ indexPage } onChange={ edit } />
      </label>
      <label>
        <button data-func="randomize" onClick={ edit }>Randomize sections</button>
      </label>
      <label>
        <span>Sections: { maxSections }</span>
        <input type="range" min="1" max={ subjects.length } data-func="maxSections" defaultValue={ maxSections } onChange={ edit } />
      </label>
      { sortedList.slice( 0, maxSections ).map( ( l, ll ) => (
        <React.Fragment key={ ll }>
          <label>
            <span>Section { ll + 1 } subject: </span>
            <select value={ l } data-id={ ll } data-func="setSection" onChange={ edit }>
              { subjects.map( ( s, ss ) => (
                <option key={ ss } value={ s }>{ capitalize( s ) }</option>
              ) ) }
            </select>
          </label>
          <label>
            <span>Section { ll + 1 } pages: { pageCounts[ l ] }</span>
            <input type="range" min="2" max="15" defaultValue={ pageCounts[ l ] } data-id={ l } data-func="pageCounts" onChange={ edit } />
          </label>
        </React.Fragment>
      ) ) }
    </aside>
	);
};

export default Editor;