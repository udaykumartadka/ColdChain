export class Incident {
    IncidentId: number;

    BeaconID: string;

    ObjectId: string;

    ObjectType: string;

    Content: string;

    Temperature: number;

    AlertEndtime: string;

    AlertStarttime: string;

    Humidity: number;

    AlertType: string;

    TamperAlert: boolean;

    ShockVibrationAlert: boolean;

    MaxTempLimit: number;

    MinTempLimit: number;

    MaxHumLimit: number;

    MinHumLimit: number;

    AcknowledgeNotes: string;

    User: string;

    Status: string;

    AlertLoc: string;

    AlertDuration: number;

    AlertDuration_years: number;

    AlertDuration_months: number;

    AlertDuration_days: number;

    AlertDuration_hours: number;

    AlertDuration_minutes: number;
}
