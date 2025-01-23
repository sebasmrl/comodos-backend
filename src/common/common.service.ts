import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { LocationData, State } from './interfaces/locations.interface';
import { Readable } from 'stream';

@Injectable()
export class CommonService {

    private logger: Logger = new Logger('CommonService');

    private locationData: LocationData;
    private flag: boolean = false;


    constructor() {
        this.loadData();
    }

    async findAllCountries() {
        if (!this.flag) return []
        return this.locationData
            .countries.map((country, index) => ({ id: index, name: country.name }))

    }

    async findAllStatesByCountryId(countryId: number) {
        if (!this.flag) return []
        return this.locationData
            .countries[countryId]
            .states.map((state, index) => ({ id: index, name: state.name }));
    }


    async findAllCitiesByStateId(params: { countryId: number, stateId: number }) {
        if (!this.flag) return [];
        const { countryId, stateId } = params;
        return this.locationData
            .countries[countryId]
            .states[stateId]
            .cities.map((city, index) => ({ id: index, name: city.name }));


    }

    async findCityById(params: { countryId: number, stateId: number, cityId: number }) {
        if (!this.flag) return {};
        const { countryId, stateId, cityId } = params;
        return this.locationData
            .countries[countryId]
            .states[stateId]
            .cities[cityId];
    }


    private async loadData(): Promise<void> {
        try {
            const filePath = path.join(__dirname, 'data', `location-data.json`);
            const fileData = fs.readFileSync(filePath, 'utf-8');
            const jsonData = JSON.parse(fileData);
            this.locationData = jsonData;
        } catch (err) {
            this.logger.error(err?.message)
        }
        this.flag = true;
    }


    async transformDANECsvToJson(csvFile: Express.Multer.File):Promise<LocationData> {
        try {
            let states: State[] = []

            const stream = new Readable();
            stream.push(csvFile.buffer);
            stream.push(null);

            const rl = readline.createInterface({
                input: stream,
                crlfDelay: Infinity,
            });

            for await (const line of rl) {
                const data = line.split(','); // Asume que las columnas están separadas por comas

                const isStateSaved = (states.filter((state) => state.name == data[2]).length == 0)
                if (isStateSaved) {
                    states.push({ name: data[2], cities: [] })
                } else {
                    states.forEach((state, index) => {
                        if (state.name == data[2]) {
                            states[index].cities.push({ name: data[4] })
                        }
                    })
                }
            }
            states.shift(); //borrar titulos de columnas
            return {
                "countries": [
                    {
                        "name": "Colombia",
                        "states": states
                    }
                ]
            }
        } catch (err) {
            this.logger.error(err?.message + " || " + err)
        }
    }



}
