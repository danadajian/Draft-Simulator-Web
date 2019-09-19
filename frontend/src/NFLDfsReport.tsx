import * as React from 'react';

interface rowAttributes {
    position: string,
    expected: number,
    actual: number,
    optimal: number,
    expected_v_actual: string,
    actual_v_optimal: string,
    expected_v_optimal: string
}

export const reportingTable = (props: {
    reportingData: rowAttributes[]}) =>
    <table>
        <tr>
            <th>Projected</th>
            <th>Actual</th>
            <th>Optimal</th>
            <th>Expected vs Actual</th>
            <th>Actual vs Optimal</th>
            <th>Expected vs Optimal</th>
        </tr>
        {props.reportingData.map(
            (row) => (
                <tr>
                    <td>{row.position}</td>
                    <td>{row.expected}</td>
                    <td>{row.actual}</td>
                    <td>{row.optimal}</td>
                    <td>{row.expected_v_actual}</td>
                    <td>{row.actual_v_optimal}</td>
                    <td>{row.expected_v_optimal}</td>
                </tr>
            )
        )}
    </table>;
