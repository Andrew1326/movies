import { Box, Image, Heading, Text, Stack, HStack, VStack, Flex, Tooltip } from '@chakra-ui/react';
import React, { MouseEventHandler } from 'react';
import { useParams } from 'react-router-dom';
import useFetch from '../../../hooks/useFetch';
import { TItemData } from './itemTypes';
import ServerErr from '../../shared/serverErr/ServerErr';
import Loader from '../../shared/loader/Loader';
import { createListItem, createListHeading } from '../../../functions';
import ResponsiveEmbed from 'react-responsive-embed';
import ItemControls from './ItemControls';
import useWindow from '../../../hooks/useWindow';

const Item = (): JSX.Element => {

    const setUrlData = useWindow()

    //* fetching item critics
    const { id } = useParams()
    const apiKey = process.env.REACT_APP_API_KEY

    const { data, error } = useFetch<TItemData>(`https://imdb-api.com/en/API/Title/${apiKey}/${id}/Trailer,Ratings`)

    //* view actor
    const viewDataInWikipedia = (name: string): MouseEventHandler<HTMLElement> => () => {
        const url = `https://en.wikipedia.org/wiki/${name.replaceAll(' ', '_')}`
        setUrlData([url, 'target=_blank'])
    }

    return (
        <Box w='100%' p='1%' marginTop={['18%', '10%', '5%']}>
            {
                data ? <Box>
                    <Stack direction={['column', 'row']}>
                        <Box w={['50%', '100%', '20%']} h='auto' m='1%'>
                            <Heading marginBottom='10%' as='h4' fontSize='2xl'>{data.title}</Heading>
                            <Image src={data.image} alt='film image' w='100%' />
                            <ItemControls data={data} />
                        </Box>
                        <Flex alignItems='stretch' flexDirection='column' justifyContent='space-evenly'>
                        <HStack>
                            <Heading size='sm' my={['1%', '0.5%', '0.5%']}>Ratings: </Heading>
                            <Stack direction={['column', 'row']}>
                                <Text fontSize='md'>IMDb: {data.ratings.imDb}</Text>
                                <Text fontSize='md'>FilmAffinity: {data.ratings.filmAffinity}</Text>
                                <Text fontSize='md'>TheMovieDb: {data.ratings.theMovieDb}</Text>
                            </Stack>
                        </HStack>
                        <HStack>
                            <Heading size='sm' my={['1%', '0.5%', '0.5%']}>Genres: </Heading>
                            <Text fontSize='md'>{data.genres}</Text>
                        </HStack>
                        <HStack>
                            <Heading size='sm' my={['1%', '0.5%', '0.5%']}>Tagline: </Heading>
                            <Text fontSize='md' as='q'>{data.tagline}</Text>
                        </HStack>
                        <HStack>
                            <Heading size='sm' my={['1%', '0.5%', '0.5%']}>Release date: </Heading>
                            <Text fontSize='md'>{data.releaseDate}</Text>
                        </HStack>
                        <HStack>
                            <Heading size='sm' my={['1%', '0.5%', '0.5%']}>{createListHeading(data.countryList, 'Countries', 'Country')}: </Heading>
                            <Text fontSize='md'>{data.countries}</Text>
                        </HStack>
                        <HStack>
                            <Heading size='sm' my={['1%', '0.5%', '0.5%']}>Time: </Heading>
                            <Text fontSize='md'>{data.runtimeStr}</Text>
                        </HStack>
                        <HStack>
                            <Heading size='sm' my={['1%', '0.5%', '0.5%']}>Awards: </Heading>
                            <Text fontSize='md'>{data.awards}</Text>
                        </HStack>
                        <HStack my={['1%', '0.5%', '0.5%']}>
                            <Heading size='sm'>{createListHeading(data.writerList, 'Writers', 'Writer')}: </Heading>
                            <Text fontSize='md'>
                                {
                                    data.writerList.map((el, i: number) => <Text key={i} as='span' _hover={{cursor: 'pointer', color: 'blue.300'}} onClick={viewDataInWikipedia(el.name)}>{`${el.name} ${i < data.writerList.length-1 ? ', ' : ''}`}</Text>)
                                }
                            </Text>
                        </HStack>
                        <HStack my={['1%', '0.5%', '0.5%']}>
                            <Heading size='sm'>Actors: </Heading>
                            <Text fontSize='md'>
                                {
                                    data.actorList.map((el, i: number) => <Tooltip key={i} bg='gray.600' label={<Box w='auto' color='whiteAlpha.900'>
                                        <Stack direction={['column', 'row']}>
                                            <Image src={el.image} alt='actor' w='125px' h='130px' />
                                            <Flex alignItems='stretch' flexDirection='column' justifyContent='space-evenly'>
                                                <Text fontSize='sm'>Actor: {el.name}</Text>
                                                <Text fontSize='sm'>Role: {el.asCharacter}</Text>
                                            </Flex>
                                        </Stack>
                                    </Box>}>
                                        <Text as='span' _hover={{cursor: 'pointer', color: 'blue.300'}} onClick={viewDataInWikipedia(el.name)}>{createListItem(el.name, i, data.actorList)}</Text>
                                    </Tooltip>)
                                }
                            </Text>
                        </HStack>
                        <HStack my={['1%', '0.5%', '0.5%']}>
                            <Heading size='sm'>{createListHeading(data.companyList, 'Companies', 'Company')}: </Heading>
                            <Text fontSize='md'>
                                {
                                    data.companyList.map((el, i: number) => <Text key={i} as='span' _hover={{cursor: 'pointer', color: 'blue.300'}} onClick={viewDataInWikipedia(el.name)}>{createListItem(el.name, i, data.companyList)}</Text>)
                                }
                            </Text>
                        </HStack>
                        </Flex>
                    </Stack>
                    <VStack m='4% 0 0 0'>
                        <Heading size='md'>Plot: </Heading>
                        <Text fontSize='md'>{data.plot}</Text>
                    </VStack>
                    <VStack m='4% 0 0 0'>
                    <Heading size='md'>Trailer: </Heading>
                    <Box w={['100%', '80%', '58%']}>
                            <ResponsiveEmbed src={data.trailer.linkEmbed} title={data.trailer.title} allowFullScreen width='100%' height='auto' />
                        </Box>
                    </VStack>
                </Box>
                :
                error ? <ServerErr title={error.name} description={error.message} />
                :
                <Box position='fixed' left='50%' top='50%' transform='translate(-50%, -50%)'><Loader /></Box>
            }
        </Box>
    )
} 

export default Item