import { supabase } from '../supabase';
import { UserProfile } from '../../components/profile/ProfileModal';
import { mapProfileFromDB, mapProfileToDB } from './mappings';

export const profileApi = {
    async get(): Promise<UserProfile | null> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data ? mapProfileFromDB(data) : null;
    },

    async upsert(profile: UserProfile): Promise<UserProfile> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const dbProfile = mapProfileToDB(profile, user.id);
        const { data, error } = await supabase
            .from('profiles')
            .upsert(dbProfile)
            .select()
            .single();

        if (error) throw error;
        return mapProfileFromDB(data);
    }
};
