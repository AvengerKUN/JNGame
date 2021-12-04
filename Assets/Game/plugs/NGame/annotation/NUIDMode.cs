
using System;

[AttributeUsage(AttributeTargets.Method)]
public class NUIDMode : Attribute
{
    public int uuid;

    public NUIDMode(int uuid)
    {
        this.uuid = uuid;
    }

}
