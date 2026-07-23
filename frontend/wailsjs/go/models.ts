export namespace main {
	
	export class Ferien {
	    id: number;
	    bezeichnung: string;
	    // Go type: time
	    beginn: any;
	    // Go type: time
	    ende: any;
	
	    static createFrom(source: any = {}) {
	        return new Ferien(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.bezeichnung = source["bezeichnung"];
	        this.beginn = this.convertValues(source["beginn"], null);
	        this.ende = this.convertValues(source["ende"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Medikament {
	    id: number;
	    medikament: string;
	    // Go type: time
	    startDatum: any;
	    // Go type: time
	    aktuellesDatum: any;
	    anzahlTabletten: number;
	    einnahmeTag: number;
	    nochvorhanden: number;
	    tageVerbleibend: number;
	
	    static createFrom(source: any = {}) {
	        return new Medikament(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.medikament = source["medikament"];
	        this.startDatum = this.convertValues(source["startDatum"], null);
	        this.aktuellesDatum = this.convertValues(source["aktuellesDatum"], null);
	        this.anzahlTabletten = source["anzahlTabletten"];
	        this.einnahmeTag = source["einnahmeTag"];
	        this.nochvorhanden = source["nochvorhanden"];
	        this.tageVerbleibend = source["tageVerbleibend"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

