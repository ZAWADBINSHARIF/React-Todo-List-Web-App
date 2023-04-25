const SearchItem = ({search, setSearch}) => {
    return (
        <form className='searchForm' onSubmit={e => e.preventDefault()}>
            <label htmlFor="search">Search</label>
            <input type="text"
                name="search"
                id="search"
                role="searchbox"
                placeholder='Search'
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
        </form>
    )
}

export default SearchItem
