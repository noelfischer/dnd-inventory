import React from 'react';
import LevelupClient from './LevelupClient';

const LevelupServer = async ({ character_id }: { character_id: string }) => {
    return (
        <LevelupClient />
    );
};

export default LevelupServer;