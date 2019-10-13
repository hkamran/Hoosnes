import {Address} from "../bus/Address";
import {Read} from "../bus/Read";
import {Write} from "../bus/Write";

export interface Mapping {
    label: string;
    read(address: Address): Read;
    write(address: Address, value: number): Write;
}