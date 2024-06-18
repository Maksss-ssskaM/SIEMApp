import React from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell} from 'recharts';
import {useGetIncidentGraphsDataQuery} from "../../redux/api/incidents.api";
import "../../styles/components/incidents/Graphs.scss"

const monthTickFormatter = (tick: string) => {
    const parts = tick.split('-');
    return `${parts[1]}-${parts[0]}`;
};

export function Graphs() {
    const {isLoading, isError, data: response} = useGetIncidentGraphsDataQuery();

    if (isLoading) return <div>Loading...</div>;
    if (isError || !response) return <div>Error loading data</div>;

    type SeverityType = 'Высокий 🔴' | 'Средний 🟠' | 'Низкий 🟡';

    const severityColorMap: Record<SeverityType, string> = {
        'Высокий 🔴': '#FF4040',
        'Средний 🟠': '#FF8042',
        'Низкий 🟡': '#FFBB28'
    };

    return (
        <div className="graphs-container">
            <div className="graphs-container__incidents-count-per-month">
                <LineChart width={400} height={400} data={response.line_chart}
                           margin={{top: 5, right: 30, bottom: 5}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="month" tickFormatter={monthTickFormatter} angle={-45} textAnchor="end" height={70}/>
                    <YAxis/>
                    <YAxis/>
                    <Tooltip/>
                    <Line type="monotone" dataKey="incident_count" name="Кол-во инцидентов" stroke="#9c1f70"
                          activeDot={{r: 8}}/>
                </LineChart>
            </div>
            <div className="graphs-container__incidents-ratio-by-severity">
                <PieChart width={400} height={400}>
                    <Pie data={response.pie_chart} dataKey="count" nameKey="severity" cx="50%" cy="50%"
                         outerRadius={150} fill="#8884d8" label>
                        {
                            response.pie_chart.map((entry, index) => (
                                <Cell key={index} fill={severityColorMap[entry.severity as SeverityType]} />
                            ))
                        }
                    </Pie>
                    <Tooltip/>
                </PieChart>
            </div>
        </div>
    );
}