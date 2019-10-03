export interface ParameterConstants {
    tvLengths?: {
        [key: string]: number;
    };
    staticLengths?: {
        [key: string]: number;
    };
    hasSubParameters?: {
        [key: string]: boolean;
    };
    [key: string]: any;
}
