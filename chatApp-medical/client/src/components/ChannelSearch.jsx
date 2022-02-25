import React, { useState, useEffect } from 'react';
import { getChannel, useChatContext } from 'stream-chat-react';

import { ResultsDropdown } from '.';
import { SearchIcon } from '../assets';

const ChannelSearch = ({setToggleContainer}) => {
    const {client, setActiveChannel } = useChatContext();
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [teamChannels, setTeamChannels] = useState([]) //which currently active team channels
    const [directChannels, setDirectChannels] = useState([]) //which currently active direct channels

    useEffect(() => {
        if(!query){
            // no query clear these
            setTeamChannels([]);
            setDirectChannels([]);
        }

    }, [query]) //call the function everytime the query changes

    const getChannels = async (text) => {
        try {
            // query our channel
            const channelResponse = client.queryChannels({
                type:'team', 
                name:{ $autocomplete: text}, 
                members: {$in: [client.userID] } // includes userID
            });
            const userResponse = client.queryUsers({
                //exclude current userID, not finding ourself in search
                id: { $ne: client.userID },
                name:{ $autocomplete: text},  
            });

            const[ channels, {users}] = await Promise.all([ channelResponse, userResponse]); // requesting happening simultaneosly 
            if(channels.length) setTeamChannels(channels);
            if(users.length) setDirectChannels(users);


        } catch (error) {
            setQuery('')
        }
    }

    const onSearch = (event) => {
        event.preventDefault();

        setLoading(true);
        setQuery(event.target.value);
        getChannels(event.target.value);
    }

    const setChannel = (channel) => {
        setQuery('');
        setActiveChannel(channel);
    }

    return (
        <div className='channel-search__container'>
            <div className='channel-search__input__wrapper'>
                <div className='channel-search__input__icon'>
                    <SearchIcon />
                </div>
                <input className='channel-search__input__text'
                    placeholder='Search'
                    type="text"
                    value={query}
                    onChange={onSearch}
                />
            </div>

{ query && (
    <ResultsDropdown 
        teamChannels={teamChannels}
        directChannels={directChannels}
        loading={loading}
        setChannel = {setChannel}
        setQuery={setQuery}
        setToggleContainer={setToggleContainer}
    />
)}

        </div>
    );
};

export default ChannelSearch;
