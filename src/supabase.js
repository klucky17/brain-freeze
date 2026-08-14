import {createClient} from '@supabase/supabase-js'
const sbUrl = 'https://cwjqzzhhfltzgamwhyqr.supabase.co'
const sbKey = 'sb_publishable_uw3Q5omqD8XiwGRQC8tWPA_0fAoeJwy'
export const supabase = createClient(sbUrl, sbKey)