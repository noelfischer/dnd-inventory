'use client'
import { GeneralSpell } from '@/app/lib/definitions';
import { fetchSpell, FormattedSpell } from './externalData';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { CornerDownLeft, CornerDownRight, Hand } from 'lucide-react';

interface Props {
    userspells: GeneralSpell[];
    learnableSpells: GeneralSpell[];
    learnSpell: (spell_id: string) => void;
    forgetSpell: (user_spell_id: string) => void;
}

const SpellsClient = ({ userspells, learnableSpells, learnSpell, forgetSpell }: Props) => {
    const lang = 'de';
    const [detailedSpells, setDetailedSpells] = useState<FormattedSpell[]>([]);
    const [search, setSearch] = useState<string>('');

    useEffect(() => {
        const spellNames = userspells.map(spell => lang === 'de' ? spell.spell_name_de : spell.spell_name_en);
        fetchSpells(spellNames, lang);
    }, [userspells]);

    async function fetchSpells(spellNames: string[], lang: 'de' | 'en') {
        const spells: FormattedSpell[] = [];
        await spellNames.forEach(async spellName => {
            const spell = await fetchSpell(spellName, lang);
            spells.push(spell);
        });
        setDetailedSpells(spells);
    }

    const learnableLevels = new Set(learnableSpells.map(spell => spell.spell_level));


    async function learnSpellClient() {
        learnSpell(search);

        const spellName = lang === 'de' ? learnableSpells.find(spell => spell.spell_id === search)?.spell_name_de : learnableSpells.find(spell => spell.spell_id === search)?.spell_name_en;
        if (!spellName) return;
        const spell = await fetchSpell(spellName, lang);
        setDetailedSpells([...detailedSpells, spell]);
        setSearch('');
    }

    function forgetSpellClient(name: string) {
        forgetSpell(name);
        setDetailedSpells(detailedSpells.filter(spell => spell.name !== name));
    }




    return (
        <Carousel className="w-full">
            <CarouselContent>
                {detailedSpells.map(spell => (
                    <CarouselItem key={spell.id}>
                        <Card className='h-full'>
                            <CardHeader>
                                <CardTitle className='flex justify-between'><span>{spell.name}</span><CornerDownRight className='h-7 w-7' /></CardTitle>
                            </CardHeader>
                            <CardContent>
                                <h3 className="text-xl font-semibold"></h3>
                                <p>{spell.level} {`(${spell.school})`}</p>
                                <p>{spell.time}</p>
                                <p>{spell.range}</p>
                                <p>{spell.components} ({spell.material_components})</p>
                                <p></p>
                                <p>{spell.duration}</p>
                                <div className="border-t border-gray-500 my-4"></div>
                                <p className='text-sm'>{spell.description}</p>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-auto" onClick={() => forgetSpellClient(spell.name)}>Remove</Button>
                            </CardFooter>
                        </Card>
                    </CarouselItem>
                ))}
                <CarouselItem>
                    <Card className='h-full'>
                        <CardHeader>
                            <CardTitle>Learnable Spells</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Command className="w-full h-80">
                                <CommandInput placeholder="Search Spells..." />
                                <CommandList>
                                    <CommandEmpty>No results found.</CommandEmpty>
                                    {Array.from(learnableLevels).map(level =>
                                        <CommandGroup heading={"Level " + level} key={level}>
                                            {learnableSpells.filter(spell => spell.spell_level === level).map(spell =>
                                                <button className="w-full empty:hidden" onClick={() => setSearch(spell.spell_id)} key={spell.spell_name_de}>
                                                    <CommandItem key={spell.spell_name_de}>
                                                        {lang === 'de' ? spell.spell_name_de : spell.spell_name_en}
                                                    </CommandItem></button>)}
                                        </CommandGroup>)}
                                </CommandList>
                            </Command>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-auto" disabled={search.length < 2} onClick={() => learnSpellClient()}>Add&nbsp;
                                {search.length > 2 && lang === 'de' ? learnableSpells.find(spell => spell.spell_id === search)?.spell_name_de : learnableSpells.find(spell => spell.spell_id === search)?.spell_name_en}
                            </Button>
                        </CardFooter>
                    </Card>

                </CarouselItem>
            </CarouselContent>
        </Carousel>
    );
};

export default SpellsClient;
