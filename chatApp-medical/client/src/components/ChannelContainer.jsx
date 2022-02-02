import React from "react";
import { Channel, useChatContext, MessageTeam } from "stream-chat-react";

import { ChannelInner, CreateChannel, EditChannel, TeamMessage } from './'
const ChannelContainer = ({ isCreating, setIsCreating, isEditing, setIsEditing, createType }) => {
    const { channel } = useChatContext(); //information of the current channel

    if (isCreating) {
        return (
            <div className="channel__container">
                <CreateChannel createType={createType} setIsCreating={setIsCreating} />
            </div>
        )
    }

    if (isEditing) {
        return (
            <div className="channel__container">
                <EditChannel setIsEditing={setIsEditing} />
            </div>
        )
    }

    //empty chat with no messages yet
    const EmptyState = () => (
        <div className="channel-empty__container">
            <p className="channel-empty__first">This is the beginning of your chat history</p>
            <p className="channel-empty__second">Send messages, attachements, links, emojis, and more!</p>
        </div>
    )

    return (
        <div className="channel__container">
            <Channel
                EmptyStateIndicator={EmptyState}
                Message={(messageProps, i) => <MessageTeam key={i} {...messageProps} />}
            >
                <ChannelInner setIsEditing={setIsEditing} />
            </Channel>
        </div>
    )
};

export default ChannelContainer;
